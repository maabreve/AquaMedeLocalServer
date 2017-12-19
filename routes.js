module.exports = function (app, mongoose, io) {

    var Board = require('./models/board.js');
    var DiaryFlow = require('./models/diary-flow.js');

    app.use(function (req, res, next) {
        console.log('Middleware disparado........');
        next();
    });

    // API
    app.route('/api/board')
        .get(function (req, res) {
            Board.find(function (err, board) {
                if (err)
                    res.status(500).send(err);

                res.status(200).json(board);
            }).catch(err => {
                console.log('Error GET /api/board - ', err);
            });
        })

        .post(function (req, res) {
            console.log(req.body);
            var board = new Board();
            board.serialNumber = req.body.serialNumber;
            board.macAddress = req.body.macAddress;
            board.dateBoardRegister = req.body.dateBoardRegister;

            board.save(function (error) {
                if (error)
                    res.status(500).send(error);

                res.status(200).json(board);
            });
        })

        .put(function (req, res) {
            Board.findOne({ serialNumber: req.body.serialNumber }, function (error, board) {
                if (error)
                    res.status(500).send(error);


                if (req.body.mainEmail && req.body.mainEmail !== '')
                    board.mainEmail = req.body.mainEmail;

                if (req.body.initialHydrometer && req.body.initialHydrometer !== '' && req.body.initialHydrometer !== 0)
                    board.initialHydrometer = req.body.initialHydrometer;

                if (req.body.peoplesInTheHouse && req.body.peoplesInTheHouse !== '' && req.body.peoplesInTheHouse !== 0)
                    board.peoplesInTheHouse = req.body.peoplesInTheHouse;

                if (req.body.dateUserRegister)
                    board.dateUserRegister = req.body.dateUserRegister;

                board.save(function (error) {
                    if (error)
                        res.status(500).send(error);

                    res.status(200).json(board);
                });
            });
        })

        .delete(function (req, res) {
            if (!req.body._id) {
                Board.remove(function (error) {
                    if (error)
                        res.status(500).send(error);

                    res.status(200).json({ message: 'Board excluído com Sucesso! ' });
                });
            } else {
                Board.remove({ _id: req.body._id }, function (error) {
                    if (error)
                        res.status(500).send(error);

                    res.status(200).json({ message: 'Board excluído com Sucesso! ' });
                });
            }
        });

    // water sensor
    app.route('/api/diaryflow')
        .get(function (req, res) {
            DiaryFlow.find(function (err, diaryflow) {
                if (err)
                    res.status(500).send(err);

                res.status(200).json(diaryflow);
            }).catch(err => {
                console.log('Error GET /api/diaryflow - ', err);
            });
        })

        .post(function (req, res) {
            var diaryflow = new DiaryFlow();
                
            console.log('diary flow received ', req.body);

            diaryflow.boardSerialNumber = req.body.boardSerialNumber;
            diaryflow.liters = req.body.liters;
            diaryflow.timestamp = new Date();
            
            diaryflow.save(function (error) {
                if (error)
                    res.status(500).send(error);
                
                res.status(200).json(diaryflow);
            });
        })
        .delete(function (req, res) {
            DiaryFlow.remove(function (error) {
                if (error)
                    res.send(error);

                res.json({ message: 'All diary flows deleted' });
            });
        });

    app.route('/api/diaryflow/:_id')
        .get(function (req, res) {
            DiaryFlow.findById(req.body._id, function (err, diaryflow) {
                if (err)
                    res.status(500).send(err);

                res.status(200).json(diaryflow);
            }).catch(err => {
                console.log('Error GET /api/diaryflow - ', err);
            });
        })
        .delete(function (req, res) {
            DiaryFlow.remove({ _id: req.body._id }, function (error) {
                if (error)
                    res.send(error);

                res.json({ message: 'Diary flow deleted' });
            });
        });
}