(function()
{
	// Canvas context and default styles

	var ctx = c.getContext("2d");
	ctx.fillStyle = '#09c';
	ctx.strokeStyle = '#09c';
	ctx.lineWidth = 2.25;
	ctx.font = '16px Helvetica';

	// Setup

	const steps = 18;
	var size = 1;

	for (var s = steps; s > 1; s--) { size <<= 1; }

	var ptsX = new Float32Array(size - 1);
	var ptsY = new Float32Array(size - 1);
	var idx = 0;

	// Point size

	const p = ((steps / 2) > 10) ? 
		1 : 1 << (10 - (steps / 2));

	// Math functions and utility

	const r = Math.sqrt(2) / 2;

	var Vec2add = (a, b) => [a[0] + b[0], a[1] + b[1]];

	var rotate = (v) => [
		(v[0] * r) - (v[1] * r),
		(v[0] * r) + (v[1] * r)];

	var rotateSC = (v, s, c) => [
		(v[0] * c) - (v[1] * s),
		(v[0] * s) + (v[1] * c)];

	// Add the points for drawing the dragon

	var dragon = function(c, ax, ay, bx, by, step) 
	{
		if (step-- > 1)
		{
			// Subtract start point from endpoint
			// to get endpoint from origin
			var l_pt = Vec2add([bx, by], [-ax, -ay]);

			// Rotated endpoint to projected midpoint
			var mid = Vec2add([ax, ay], 
				rotate([l_pt[0] * r, l_pt[1] * r])
			);

			// Add midpoints to array
			ptsX[idx]   = mid[0];
			ptsY[idx++] = mid[1];

			// recurse again
			dragon(c, mid[0], mid[1], ax, ay, step);
			dragon(c, mid[0], mid[1], bx, by, step);	
		}
	};

	// Draw path for a single line segment

	var drawLine = function(ctx, idx, a, b)
	{
		var cr = ((idx - 1) >> 0) & 255;
		var cg = ((idx - 1) >> 4) & 255;
		var cb = ((idx - 1) >> 8) & 255;

		// Comment this line out for a faster (but more plain) drawing
		ctx.strokeStyle = 'rgb('+ cr +', '+ cg +','+ cb +')';

		ctx.beginPath();
		// Half pixel offset for crisp lines
		ctx.moveTo(b[0] + 0.5, b[1] + 0.5);
		ctx.lineTo(a[0] + 0.5, a[1] + 0.5);

		ctx.closePath();
		ctx.stroke();
	}

	// Draw points for the curve

	var drawPoints = function()
	{
		var startTime = new Date();
		ctx.clearRect(0, 0, c.width, c.height);

		// Draw the points
		for (var i = 0; i < ptsX.length;)
		{
			var r = (i >> 5) & 255;
			var g = (i >> 9) & 255;
			var b = (i >> 7) & 255;

			// Comment this line out for a faster (but more plain) drawing
			ctx.fillStyle = 'rgb('+ r +', '+ g +','+ b +')';

			// Small squares as points
			ctx.fillRect(ptsX[i], ptsY[i++], p, p);
		}

		const execTime = "Render time: "+ (new Date().getTime() - startTime.getTime()) +" ms";

		ctx.fillStyle = '#777';
		ctx.fillText(execTime, 4, c.height - 16);
	}

	// Start adding the points

	dragon(ctx, 
		192, 256, /* start */ 
		704, 256, /* end */ 
		steps
	);

	drawPoints();

})();
