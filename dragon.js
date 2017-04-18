(function()
{
	// Canvas context and default styles

	var ctx = c.getContext("2d");
	ctx.fillStyle = '#09c';
	ctx.strokeStyle = '#09c';
	ctx.lineWidth = 1.5;
	ctx.font = '16px Helvetica';

	// Setup

	const steps = 18;
	var size = 1;

	for (var s = steps; s > 1; s--) { size <<= 1; }

	// Point locations

	var ptsX = new Float32Array(size - 1);
	var ptsY = new Float32Array(size - 1);
	var idx = 0;

	// Point size

	//const p = ((steps / 2) > 10) ? 
	//	1 : 1 << (10 - (steps / 2));
	const p = 1.5;

	// Math functions

	const r = Math.sqrt(2) / 2;
	var Vec2add = (a, b) => [a[0] + b[0], a[1] + b[1]];

	var rotate = (v) => [
		(v[0] * r) - (v[1] * r),
		(v[0] * r) + (v[1] * r)];

	// Animation variables

	const fillRate  = 1 << 12;
	var colorRate = steps - 10;

	// Draw path for a single line segment

	var drawLine = (c, idx, a, b) => {

		// Switch up colors 
		var cr = (idx >> (colorRate - 3)) & 255;
		var cg = (idx >> (colorRate + 0)) & 255;
		var cb = (idx >> (colorRate - 1)) & 255;

		c.strokeStyle = 'rgb('+ cr +', '+ cg +','+ cb +')';
		c.beginPath();

		// Half pixel offset for crisp lines
		c.moveTo(b[0] + 0.5, b[1] + 0.5);
		c.lineTo(a[0] + 0.5, a[1] + 0.5);

		c.closePath();
		c.stroke();
	}

	// Draw points for the curve

	var drawPoints = () => {

		const startTime = new Date();

		for (var i = 0; i < ptsX.length;)
		{
			// Switch up colors 
			var r = (i >> (colorRate - 3)) & 255;
			var g = (i >> (colorRate + 0)) & 255;
			var b = (i >> (colorRate - 1)) & 255;

			// Comment this line out for a faster (but more plain) drawing
			ctx.fillStyle = 'rgb('+ r +', '+ g +','+ b +')';

			// Points as small squares
			ctx.fillRect(ptsX[i], ptsY[i++], p, p);
		}

		const execTime = "Render time: "+ (new Date().getTime() - startTime.getTime()) +" ms";

		ctx.fillStyle = '#777';
		ctx.fillText(execTime, 4, c.height);
	}

	// Add the points for drawing the dragon

	var dragon = (a, b, step) => {

		if (step-- > 1)
		{
			// Subtract start point from endpoint
			// to get endpoint's local position
			var l_pt = Vec2add(b, [-a[0], -a[1]]);

			// Rotate endpoint to projected midpoint
			// and translate back to the world position
			var mid = Vec2add(a, 
				rotate([l_pt[0] * r, l_pt[1] * r])
			);

			// Add midpoints to array
			ptsX[idx]   = mid[0];
			ptsY[idx++] = mid[1];

			// recurse again
			dragon(mid, a, step);
			dragon(mid, b, step);	
		}
	};

	// Start adding the points

	dragon( 
		[192, 256], /* start */ 
		[704, 256], /* end */ 
		steps
	);

	drawPoints();
	console.log(ptsX)

})();
