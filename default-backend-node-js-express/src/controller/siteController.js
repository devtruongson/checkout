const SiteService = require('../Services/SiteService');

class SiteController {
    // get view

    getLogin(req, res) {
        res.render('login.ejs', { data: '' });
    }

    getRegister(req, res) {
        res.render('register.ejs', { data: '' });
    }

    async getHome(req, res) {
        const data = await SiteService.handleGetAllStudents();
        const classes = await SiteService.handleGetAllClasses();
        const groups = await SiteService.handleGetAllGroups();

        res.render('homeTeacher.ejs', { data: '', students: data, classes, groups });
    }

    async getCheckAuth(req, res) {
        res.render('checkauth.ejs');
    }

    async getViewGroup(req, res) {
        try {
            const students = await SiteService.handleGetAllStudents();
            const data = await SiteService.GetOneGroup(req.params.id);
            res.render('groupEdit.ejs', { data: data ? data : nul, students });
        } catch (error) {
            console.log(error);
        }
    }

    // handle api

    async handleLogin(req, res) {
        try {
            const data = await SiteService.handleLogin(req.body);

            if (data.errCode === 0) {
                const classes = await SiteService.handleGetAllClasses();
                const students = await SiteService.handleGetAllStudents();
                const groups = await SiteService.handleGetAllGroups();
                res.render('homeTeacher.ejs', { data, students, classes, groups });
            } else {
                res.render('login.ejs', { data: data.msg });
            }
        } catch (error) {
            console.log('co loi xay ra :', error);
        }
    }

    async handleRegister(req, res) {
        try {
            const data = await SiteService.handleRegister(req.body);

            if (data.errCode === 0) {
                const students = await SiteService.handleGetAllStudents();
                const groups = await SiteService.handleGetAllGroups();
                res.render('homeTeacher.ejs', { data, students, groups });
            } else {
                res.render('register.ejs', { data: data.msg });
            }
        } catch (error) {
            console.log('co loi xay ra :', error);
        }
    }

    async handleCreateGroup(req, res) {
        try {
            await SiteService.handleCreateGroup(req.body);

            res.redirect('/home');
        } catch (error) {
            console.log(error);
        }
    }

    async handleCreateClass(req, res) {
        try {
            await SiteService.handleCreateClass(req.body, req.query.id);

            res.redirect('/home');
        } catch (error) {
            console.log(error);
        }
    }

    async handleGetAllClasses(req, res) {
        try {
            const data = await SiteService.handleGetAllClasses(req.query.id);

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handleCreateMeeting(req, res) {
        try {
            const data = await SiteService.handleCreateMeeting(req.body);

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }
}

module.exports = new SiteController();
