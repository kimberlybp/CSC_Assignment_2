// Enter the name of the bucket that you have created here
const BUCKET_NAME = 'cscassignment2-profilepictures';
const FILE_PERMISSION = 'public-read';
const { Buffer } = require('buffer');
const joiValidation = require('../joiValidation/talentDetailsValidation');

function talentDetails(con, s3, firestore, algoliaIndex) {


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

    function search(req, res) {
        let array = [];
        let query = req.query.query;
        if (query) {
            algoliaIndex
                .search(query, {
                    attributesToRetrieve: [
                        'objectID',
                        'TalentId',
                        'FirstName',
                        'LastName',
                        'Description',
                        'Gender',
                        'Age',
                        'Interst',
                    ],
                    hitsPerPage: 50,
                })
                .then(({ hits }) => {
                    Object.values(hits).forEach((value) => {
                        array.push(value);
                    });
                    if (array.length > 0) {
                        res.send({ data: hits });
                    } else res.send(`No record(s) available.`);
                })
                .catch((err) => res.status(400).send(`Error executing search: ${err}`));
        } else res.status(400).send(`Please provide a query string.`);
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
        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }

    function getTalentDetailsByFirebase(req, res) {
        const { error, value } = joiValidation.objectIDSchema.validate(req.query);
        if (!error) {
            con.connect(function (err) {
                con.query(`SELECT * FROM main.Talents where objectID='${req.query.objectID}'`, function (err, result, fields) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ code: 500, err });

                    }
                    if (result) res.status(200).json({ code: 200, result });
                });
            });
        } else {
            res.status(400).json({ code: 400, message: error });
        }
    }

    function addTalentToAlgolia(req, res) {
        var talent = req.body.talent;
        algoliaIndex.saveObject(talent).then((objectID) => {
            res.status(200).json({ code: 200, objectID });
        }).catch((e) => {
            res.status(400).json({ code: 400, message: 'Error with Algolia' });
        })
    }

    function getTalentDataFromFirestore(req, res) {
        var docRef = firestore.collection("UserSubscriptionPlans").doc(req.query.uid);

        docRef.get().then((doc) => {
            if (doc.exists) {
                res.status(200).json({ code: 200, data: doc.data()})
            } else {
                // doc.data() will be undefined in this case
                res.status(400).json({ code: 400, message: 'Unable to find user.' });
            }
        }).catch((error) => {
            res.status(400).json({ code: 500, message: 'Firestore Internal Server Error' });
        });
    }

    return {
        post: postTalentDetails,
        postWithFirebase: postTalentDetailsWithFirebase,
        postProfilePicture: postTalentProfilePicture,
        postUserSubscriptionPlan: postUserSubscriptionPlan,
        getTalentDetailsByFirebase: getTalentDetailsByFirebase,
        search: search,
        addTalentToAlgolia: addTalentToAlgolia,
        getTalentDataFromFirestore: getTalentDataFromFirestore
    }

}

module.exports = talentDetails