define(['moment'], function (moment) {

	/**Add points from te regressive curve in data
	 * getRegressiveCurve (data, days)
	 * data = [{value : number, x : date()}]
	 * days = number (of projected days wanted)
	 */
	return function getRegressiveCurve(data, days) {
		const coeff = regLin(data.map(({ maxtemp }) => maxtemp));
		const timeCoeff = getUnitOfTime(data, days);
		
		let tabResult = [];

		for (let index = 0; index < data.length; index++) {
			tabResult.push({
				created_at: data[index].created_at,
				maxtemp: data[index].maxtemp,
				average: (Math.round((coeff.a * index + coeff.b) * 100) / 100)
			})
		}

		let estimated_data = [];
		for (let i = 0; i < timeCoeff.nb; i++) {

			const tempMax = 250;
			const tempMin = -50;
			let calculatedTemps = (Math.round((coeff.a * (data.length + i) + coeff.b) * 100) / 100) > tempMax ?
				tempMax : ((Math.round((coeff.a * (data.length + i) + coeff.b) * 100) / 100) < tempMin) ?
					tempMin : (Math.round((coeff.a * (data.length + i) + coeff.b) * 100) / 100);

			let dateTime = new Date();
			const last_date = new Date(data[data.length - 1].created_at);
			dateTime.setTime(last_date.getTime() + (i + 1) * timeCoeff.ut)
			let transformedDate = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

			estimated_data.push({
				//average: calculatedTemps,
				average: calculatedTemps,
				created_at: transformedDate
			})
		}

		tabResult = tabResult.concat(estimated_data);
		return tabResult;
	}

	function getUnitOfTime(data, days) {
		let first_date = new Date(data[0].created_at);
		let last_date = new Date(data[data.length - 1].created_at);
		// let start_date, end_date = new Date();

		let unit_of_time = 0;

		if (first_date > last_date) {//(first_date.getTime() > last_date.getTime()) {
			unit_of_time = Math.round((first_date.getTime() - last_date.getTime()) / data.length);
			// start_date = last_date;
			// end_date = first_date;
		} else {
			unit_of_time = Math.round((last_date.getTime() - first_date.getTime()) / data.length);
			// start_date = first_date;
			// end_date = last_date;
		}

		//milliseconds * second * minutes * hours * days (projected on "x" days)
		let nb_val_calculated = (Math.round(1000 * 60 * 60 * 24 * days / unit_of_time)) < 500 ?
			(Math.round(1000 * 60 * 60 * 24 * days / unit_of_time)) : 500;

		return { nb: nb_val_calculated, ut: unit_of_time }; //end_date;
	}

	function regLin(points_y) {
		// Ajuste une droite d'équation a*x + b sur les points (x, y) par la méthode
		// des moindres carrés.

		// 		Args :
		// * x(list): valeurs de x
		// 		* y(list): valeurs de y
		// 	Return:
		// * a(float): pente de la droite
		// 		* b(float): ordonnée à l'origine

		// # initialisation des sommes
		let x_sum = 0;
		let x2_sum = 0;
		let y_sum = 0;
		let xy_sum = 0;
		try {
			// # calcul des sommes
			for (let index = 0; index < points_y.length; index++) {
				x_sum += index;
				x2_sum += index ** 2;
				y_sum += points_y[index];
				xy_sum += index * points_y[index];
			}
			// # nombre de points
			npoints = points_y.length;
			// # calcul des paramétras
			const a = (npoints * xy_sum - x_sum * y_sum) / (npoints * x2_sum - x_sum ** 2);
			const b = (x2_sum * y_sum - x_sum * xy_sum) / (npoints * x2_sum - x_sum ** 2);
			// # renvoie des parametres
			return { a: a, b: b };
		} catch (error) {
			console.log(error);
		}
	}

	function getLastNDatas(currentIndex, n, data) {
		let lastNData = [];
		let limit = (currentIndex - n >= 0) ? currentIndex - n : -1;

		for (let i = currentIndex; i > limit; i--) {
			lastNData.unshift(data[i]);
		}
		return lastNData;
	}

	function getAverage(data) {
		let sum = 0;
		for (let i = 0, len = data.length; i < len; i++) {
			sum += data[i].maxtemp;
		}
		average = (Math.round((sum / data.length) * 100) / 100); // à proteger avec un try - catch
		return average;
	}
})