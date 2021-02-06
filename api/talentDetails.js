// Enter the name of the bucket that you have created here
const BUCKET_NAME = 'cscassignment2-profilepictures';
const FILE_PERMISSION = 'public-read';
const { Buffer } = require('buffer');
const joiValidation = require('../joiValidation/talentDetailsValidation');

function talentDetails(con, s3, firestore) {


    function postTalentDetails(req, res) {
        if (req.body.FirstName && req.body.LastName) {
            console.log('Request received');
            con.connect(function (err) {
                var desc = req.body.Description ? req.body.Description : null;
                var gender = req.body.Gender ? req.body.Gender : null;
                var age = req.body.Age ? req.body.Age : null;
                var profilePic = req.body.ProfilePic ? req.body.ProfilePic : null;
                con.query(`INSERT INTO main.Talents (FirstName, LastName, Description, Gender, Age, ProfilePic) VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${desc}', '${gender}', '${age}', '${profilePic}')`, function (err, result, fields) {


                    if (err) response.status(500).json({ code: 500, err });
                    if (result) res.status(200).json({ code: 200, result });
                    if (fields) console.log(fields);
                });
            });
        } else {
            console.log('Missing a parameter');
        }

    }

    function postTalentDetailsWithFirebase(req, res) {
        if (req.body.FirstName && req.body.LastName && req.body.FirebaseUid) {
            console.log('Request received');
            con.connect(function (err) {
                var desc = req.body.Description ? req.body.Description : null;
                var gender = req.body.Gender ? req.body.Gender : null;
                var age = req.body.Age ? req.body.Age : null;
                var profilePic = req.body.ProfilePic ? req.body.ProfilePic : null;
                con.query(`INSERT INTO main.Talents (FirstName, LastName, Description, Gender, Age, ProfilePic, FirebaseUid) VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${desc}', '${gender}', '${age}', '${profilePic}','${req.body.FirebaseUid}')`, function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ code: 500, err });
                        
                }
                    if (result) res.status(200).json({ code: 200, result });
                });
            });
        } else {
            res.status(400).json({ code: 400, message: 'Missing required parameter.' });
        }
    }

    function postTalentProfilePicture(req, res) {
        const { error, value } = joiValidation.postTalentProfilePictureSchema.validate(req.body);
        if (!error) {
            try {
                // setting up s3 upload parameters
                const params = {
                    Bucket: BUCKET_NAME,
                    ACL: FILE_PERMISSION,
                    Key: req.body.fileName, // file name you want to save as
                    Body: getImgBuffer(req.body.image),
                    ContentEncoding: 'base64',
                    ContentType: req.body.fileType
                };

                // Uploading files to the bucket
                s3.upload(params, function (err, data) {
                    if (err) {
                        res.status(500).json({ code: 500, err });
                    } else {
                        res.status(200).json({ code: 200, message: `File uploaded successfully.`, url: data.Location })
                    }
                });
            } catch (e) {
                res.status(400).json({ code: 400, message: "Something wrong with parameters" })
            }
        } else {
            res.status(400).json({ code: 400, message: error });
        }

    }

    function getImgBuffer(base64) {
        const base64str = base64.replace(/^data:image\/\w+;base64,/, '');
        return Buffer.from(base64str, 'base64');
    }

    async function postUserSubscriptionPlan(req, res) {
        const { error, value } = joiValidation.postUserSubscriptionPlanSchema.validate(req.body);
        if (!error) {
        var object = {
            uid: req.body.uid,
            stripeCustomerId: req.body.stripeCustomerId,
            subscriptionPriceId: req.body.subscriptionPriceId,
            createdAt: new Date()
        }

        var oneRow = firestore.collection('UserSubscriptionPlans').doc(object.uid);

        await oneRow
            .set(object)
            .then(res.status(200).json({ message: 'Successfully added.' }))
            .catch((err) => {
                res.status(400).json({ err });
            });
        }else{
            res.status(400).json({ code: 400, message: error });
        }
    }

    function getTalentDetailsByFirebase(req, res){
        con.connect(function (err) {
            var desc = req.body.Description ? req.body.Description : null;
            var gender = req.body.Gender ? req.body.Gender : null;
            var age = req.body.Age ? req.body.Age : null;
            var profilePic = req.body.ProfilePic ? req.body.ProfilePic : null;
            con.query(`INSERT INTO main.Talents (FirstName, LastName, Description, Gender, Age, ProfilePic, FirebaseUid) VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${desc}', '${gender}', '${age}', '${profilePic}','${req.body.FirebaseUid}')`, function (err, result, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ code: 500, err });
                    
            }
                if (result) res.status(200).json({ code: 200, result });
            });
        });
    }


    return {
        post: postTalentDetails,
        postWithFirebase: postTalentDetailsWithFirebase,
        postProfilePicture: postTalentProfilePicture,
        postUserSubscriptionPlan: postUserSubscriptionPlan,
    }

}

module.exports = talentDetails