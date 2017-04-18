(function()
{
	// Canvas context and default styles

	var ctx = c.getContext("2d");
	ctx.fillStyle = '#09c';
	var colorRate = 8;
	var idx = 0, g = 1;

	// Add the points for drawing the dragon

	var dragon = function (x1, y1, x2, y2, step) 
	{
		if (step-- > 1)
		{
			var dx = x2 - x1,
				dy = y2 - y1;

			var midX = x1 + (dx - dy) / 2,
				midY = y1 + (dx + dy) / 2;

			dragon(midX, midY, x1, y1, step);
			dragon(midX, midY, x2, y2, step);	

			// Switch up colors 
			var cr = (idx >> (colorRate - 3)) & 255;
			var cg = (idx >> (colorRate + 0)) & 255;
			var cb = (idx >> (colorRate - 1)) & 255;

			ctx.fillStyle = 'rgb('+ cr +', '+ cg +','+ cb +')';
				
			// Points as small squares
			ctx.fillRect(midX, midY, 1.5, 1.5);
			idx++;
		}
	};

	// Start adding the points

	dragon( 
		192, 256, /* start */ 
		704, 256, /* end */ 
		18 		  /* steps */
	);

})();
