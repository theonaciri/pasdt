define(['moment'], function (moment) {

	/**Add points from te regressive curve in data
	 * getRegressiveCurve (data, days)
	 * data = [{value : number, x : date()}]
	 * days = number (of projected days wanted)
	 */
	return function getRegressiveCurve(data, days_before, days_after) {
		let tabResult = data;

		const last_data = getValuesOfLastDays(data, days_before);

		const tared_data = getTaredDate(last_data);

		const coeff = regLin(tared_data);
		
		//calculate average for existing datas
		for (let index = tabResult.length-1; index > tabResult.length - last_data.length; index--) {
			let average = (Math.round((coeff.a * tared_data[index + last_data.length - tabResult.length].x + coeff.b) * 100) / 100);
			tabResult[index] = ({
				d: tabResult[index].d,
				t: tabResult[index].t,
				average: average
			})
		}
		
		const unit_of_time = getUnitOfTime(last_data, days_after)/1000;

		const number_of_values_projected = getNumberOfValuesProjected(unit_of_time, days_after);
		
		//calculate average for projected datas
		let estimated_data = [];
		
		for (let i = 1; i <= number_of_values_projected; i++) {

			let offset = i * unit_of_time; // in second

			const temp_max = 250;
			const temp_min = -50;

			let calculatedTemps = Math.round((coeff.a * (tared_data[tared_data.length-1].x + offset) + coeff.b) * 100) / 100;

			calculatedTemps = (calculatedTemps > temp_max) ? temp_max : 
			(calculatedTemps < temp_min) ? temp_min : 
			calculatedTemps;

			let dateTime = new Date();
			const last_date = new Date(last_data[last_data.length - 1].d);
			dateTime.setTime(last_date.getTime() + offset * 1000) // "*1000" convert in milliseconds
			let transformedDate = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

			estimated_data.push({
				average: calculatedTemps,
				d: transformedDate
			})
		}
		
		tabResult = tabResult.concat(estimated_data);
		return tabResult;
	}

	function getTaredDate(last_data){
		
		const start_date = new Date(last_data[0].d);
		const tare = start_date.getTime();

		let result = [];
		let calculated_date;
	
		for (let index = 0; index < last_data.length; index++) {
			calculated_date = ((new Date(last_data[index].d)).getTime() - tare) / 1000; // "/1000" convert in second
			result[index] = {
				x : calculated_date,
				y : last_data[index].t
			}
		}
		return result;
	}

	function getValuesOfLastDays(data, days_before){
		const stopdate = moment(data[data.length-1].d).subtract(days_before, "days").format("YYYY-MM-DD");
		let last_data = [];
		let i = data.length - 1;
		let current_date;

		do
		{
			last_data.unshift(data[i]);
			current_date = moment(data[i].d).format("YYYY-MM-DD");
			i--;
		}while(current_date > stopdate && i > 0)

		return last_data;
	}

	function getUnitOfTime(data, days) {
		let first_date = new Date(data[0].d);
		let last_date = new Date(data[data.length - 1].d);
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

		return unit_of_time;
	}

	function getNumberOfValuesProjected (unit_of_time, days){
		//second * minutes * hours * days (projected on "x" days)
		let nb_val_calculated = (Math.round(60 * 60 * 24 * days / unit_of_time)) < 500 ?
			(Math.round(60 * 60 * 24 * days / unit_of_time)) : 500;

		return nb_val_calculated;
	}

	function regLin(points_xy) {
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
			for (let index = 0; index < points_xy.length; index++) {
				x_sum += points_xy[index].x;
				x2_sum += points_xy[index].x ** 2;
				y_sum += points_xy[index].y;
				xy_sum += points_xy[index].x * points_xy[index].y;
			}
			// # nombre de points
			npoints = points_xy.length;
			// # calcul des paramétras
			const a = (npoints * xy_sum - x_sum * y_sum) / (npoints * x2_sum - x_sum ** 2);
			const b = (x2_sum * y_sum - x_sum * xy_sum) / (npoints * x2_sum - x_sum ** 2);
			// # renvoie des parametres
			return { a: a, b: b };
		} catch (error) {
			console.error(error);
			console.error("May be an overload in regressive curve calculation")
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
			sum += data[i].t;
		}
		average = (Math.round((sum / data.length) * 100) / 100); // à proteger avec un try - catch
		return average;
	}
})