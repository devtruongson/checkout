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

            res.render('groupEdit.ejs', { data: data ? data : null, students });
        } catch (error) {
            console.log(error);
        }
    }

    async getViewGroupUser(req, res) {
        try {
            const students = await SiteService.handleGetAllStudents();
            const data = await SiteService.GetOneGroup(req.params.id);
            const meetings = await SiteService.handleGetAllMeetingActive();

            res.render('groupEditUser.ejs', { data: data ? data : null, students, meetings });
        } catch (error) {
            console.log(error);
        }
    }

    async getManageCalendar(req, res) {
        try {
            const data = await SiteService.handleGetAllStudents();
            const classes = await SiteService.handleGetAllClasses();
            const groups = await SiteService.handleGetAllGroups();
            const meetings = await SiteService.handleGetAllMeeting(req.params.id);

            res.render('manageCalendar.ejs', { data: '', students: data, classes, groups, meetings });
        } catch (error) {
            console.log(error);
        }
    }

    async getGetMeeting(req, res) {
        try {
            const meeting = await SiteService.getGetMeeting(req.params.id);

            res.render('meeting.ejs', { meeting, id: req.params.id ? req.params.id : null });
        } catch (error) {
            console.log(error);
        }
    }

    async getGetMeetingUser(req, res) {
        try {
            const meeting = await SiteService.getGetMeetingUser(req.params.id);

            res.render('meetingUser.ejs', { meeting, id: req.params.id ? req.params.id : null });
        } catch (error) {
            console.log(error);
        }
    }

    async getHomeUser(req, res) {
        const data = await SiteService.handleGetAllStudents();
        const groups = await SiteService.handleGetAllGroups();

        res.render('homeUser.ejs', { data: '', students: data, groups });
    }

    async getGetManageUser(req, res) {
        const data = await SiteService.handleGetAllUser();

        res.render('managUser.ejs', { users: data });
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

    async handleCanceledMeeting(req, res) {
        try {
            const data = await SiteService.handleCanceledMeeting(req.body.id);

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

    async handleDoneMeeting(req, res) {
        try {
            const data = await SiteService.handleDoneMeeting(req.body.id);

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handleAddGroupMeeting(req, res) {
        try {
            const data = await SiteService.handleAddGroupMeeting(req.body);

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handWorkMeetings(req, res) {
        try {
            await SiteService.handWorkMeetings(req.body);

            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }

    async handWorkMeetingUser(req, res) {
        try {
            await SiteService.handWorkMeetingUser(req.body);

            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }

    async handleGetAllGroupAssets(req, res) {
        try {
            const data = await SiteService.handleGetAllGroupAssets(req.query.id);

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handleGetAllMeetingsEmpty(req, res) {
        try {
            const data = await SiteService.handleGetAllMeetingsEmpty();

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handleActiveGroup(req, res) {
        try {
            const data = await SiteService.handleActiveGroup(req.body);

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handleBookingMeetingEmpty(req, res) {
        try {
            const data = await SiteService.handleBookingMeetingEmpty(req.body);

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handleGetDetailUser(req, res) {
        try {
            const data = await SiteService.handleGetDetailUser(req.query.id);

            res.status(200).json(data);
        } catch (error) {
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handleUpdateUser(req, res) {
        try {
            const data = await SiteService.handleUpdateUser(req.body);

            res.redirect('/get-manage-user');
        } catch (error) {
            console.log(error);
            res.status(200).json({
                errCode: -1,
                msg: 'err from server',
            });
        }
    }

    async handleDeleteUser(req, res) {
        try {
            const data = await SiteService.handleDeleteUser(req.params.id);

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
