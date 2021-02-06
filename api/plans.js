function plans(con){
    function getPlans(req, res) {
        con.connect(function (err) {
            con.query(`SELECT * FROM main.Plans`, function (err, result, fields) {
                console.log(result);
                if (err) response.status(500).json({ code: 500, err });
                if (result) res.status(200).json({ code: 200, result, publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
            });
        });
    }
    

    return{
        getAll: getPlans
    }

}

module.exports = plans