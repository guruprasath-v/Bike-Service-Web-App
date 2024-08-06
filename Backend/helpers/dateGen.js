function generateDateRange() {
    let dates = [];
    for (let i = 1; i <= 10; i++) {
        let date = new Date();
        date.setDate(date.getDate() + i);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        dates.push(`${year}-${month}-${day}`);
    }
    return dates.join(', ');
}


export default generateDateRange;