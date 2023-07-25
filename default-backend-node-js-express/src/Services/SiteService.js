const { Op } = require('sequelize');
const CheckPassword = require('../helper/Checkpass');
const GeneratePassword = require('../helper/GeneratePass');
const handleRelationShipJson = require('../helper/relationShipJson');
const db = require('../models');

class SiteService {
    handleLogin(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await db.User.findOne({
                    where: {
                        email: data.email,
                    },
                });

                if (!user) {
                    return resolve({
                        errCode: 1,
                        msg: 'email không tồn tại trong hệ thống!',
                    });
                }

                // check password
                const check = CheckPassword(data.password, user.password);

                if (!check) {
                    return resolve({
                        errCode: 1,
                        msg: 'Sai mật khẩu!',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    user: user,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    handleRegister(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const check = await this.CheckEmailExist(data.email);

                if (check) {
                    return resolve({
                        errCode: 1,
                        msg: 'Email already exists',
                    });
                }

                const passwordHash = GeneratePassword(data.password);

                const user = await db.User.create({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: passwordHash,
                    maso: data.maso,
                    class: data.class,
                    role: 'R1',
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    user: user,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleGetAllStudents() {
        return new Promise(async function (resolve, reject) {
            try {
                const students = await db.User.findAll({
                    where: {
                        role: 'R1' /* R1 là học sinh R0 là giáo viên */,
                    },
                    attributes: {
                        exclude: ['password', 'role'] /* khong tra ve password voi role */,
                    },
                    raw: true,
                });

                resolve(students);
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleCreateGroup(data) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.Group.create({
                    title: data.title,
                    student: JSON.stringify(data.student),
                    note: data.note,
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleGetAllGroups() {
        return new Promise(async function (resolve, reject) {
            try {
                const groups = await db.Group.findAll({
                    raw: true,
                });

                resolve(groups);
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleGetAllClasses(id = '') {
        return new Promise(async function (resolve, reject) {
            try {
                const classes = await db.Class.findAll({
                    where: {
                        teacher: id,
                    },
                    include: [{ model: db.Group, as: 'DataGroup' }],
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data: classes,
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    async handleCreateClass(data, id) {
        return new Promise(async (resolve, reject) => {
            const IDGroup = [];

            for (const idGr of data.group) {
                let check = false;
                check = await db.Class.findOne({
                    where: {
                        teacher: id,
                        group: String(idGr),
                    },
                });

                if (check) {
                    IDGroup.push(idGr);
                }
            }

            let dataGroup = [data.group];

            if (typeof data.group == 'object') {
                dataGroup = data.group.filter((number) => !IDGroup.includes(number));
            } else {
                dataGroup = IDGroup.find((number) => dataGroup[0] == number);

                if (dataGroup) {
                    dataGroup = [];
                } else {
                    dataGroup = [data.group];
                }
            }

            try {
                if (dataGroup.length === 0) {
                    return resolve();
                } else {
                    for (const studentId of dataGroup) {
                        await db.Class.create({
                            group: studentId,
                            title: data.title,
                            teacher: id,
                        });
                    }
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async GetOneGroup(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const group = await db.Group.findOne({
                    where: {
                        id: id,
                    },
                    include: [
                        { model: db.Meeting, as: 'DataMeeting' },
                        {
                            model: db.History,
                            as: 'DataHistoryData',
                            include: [{ model: db.Meeting, as: 'DataHistory' }],
                        },
                    ],
                });

                let DataUser = [];

                if (group) {
                    DataUser = await handleRelationShipJson(db.Group, db.User, 'student', {
                        where: {
                            id: group.id,
                        },
                        raw: true,
                    });

                    console.log(JSON.stringify(DataUser));

                    resolve({
                        data: {
                            group,
                            users: DataUser,
                        },
                    });
                } else {
                    resolve();
                }
            } catch (error) {
                resolve();
            }
        });
    }

    async handleCreateMeeting(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const MeetingGroup = await db.Group.findOne({
                    where: {
                        id: data.groupID,
                    },
                    raw: true,
                });

                if (!MeetingGroup?.meeting) {
                    if (data.type == 'group') {
                        const newMeeting = await db.Meeting.create({
                            day: data.day,
                            startTime: data.startTime,
                            endTime: data.endTime,
                            idTeacher: data.isTeacher === 'R0' ? data.idTeacher : null,
                            isTeacher: data.isTeacher == 'R1' ? false : true,
                            count: 1,
                        });

                        await db.Group.update(
                            {
                                meeting: newMeeting.id,
                                active: data.isTeacher == 'R1' ? false : true,
                            },
                            {
                                where: {
                                    id: data.groupID,
                                },
                            },
                        );
                    }
                } else {
                    if (data.type == 'group') {
                        const DataMeeting = await db.Meeting.findOne({
                            where: {
                                id: MeetingGroup.meeting,
                            },
                            raw: true,
                        });

                        await db.Meeting.update(
                            {
                                count: DataMeeting > 0 ? DataMeeting - 1 : 0,
                            },
                            {
                                where: {
                                    id: MeetingGroup.meeting,
                                },
                            },
                        );

                        await db.History.create({
                            groupID: data.groupID,
                            meetingID: MeetingGroup.meeting,
                        });

                        const newMeeting = await db.Meeting.create({
                            day: data.day,
                            startTime: data.startTime,
                            endTime: data.endTime,
                            idTeacher: data.isTeacher === 'R0' ? data.idTeacher : null,
                            isTeacher: data.isTeacher == 'R1' ? false : true,
                            count: 1,
                        });

                        await db.Group.update(
                            {
                                meeting: newMeeting.id,
                                active: data.isTeacher == 'R1' ? false : true,
                            },
                            {
                                where: {
                                    id: data.groupID,
                                },
                            },
                        );
                    }
                }

                if (data.type != 'group') {
                    await db.Meeting.create({
                        day: data.day,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        isTeacher: data.isTeacher,
                        idTeacher: data.isTeacher === 'R0' ? data.idTeacher : null,
                        active: data.isTeacher == 'R1' ? false : true,
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    async handleGetAllMeeting(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const meetings = await db.Meeting.findAll({
                    where: {
                        idTeacher: id,
                    },
                    include: [
                        { model: db.Group, as: 'DataMeeting' },
                        { model: db.Group, as: 'Data' },
                        { model: db.User, as: 'DataUser' },
                    ],
                });

                resolve(meetings);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async handleCanceledMeeting(id) {
        return new Promise(async function (resolve, reject) {
            try {
                await db.Group.update(
                    {
                        meeting: null,
                    },
                    {
                        where: {
                            meeting: id,
                        },
                    },
                );

                const meetings = await db.Meeting.update(
                    {
                        isCancelled: true,
                    },
                    {
                        where: {
                            id: id,
                        },
                    },
                );

                resolve(meetings);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async handleDoneMeeting(id) {
        return new Promise(async function (resolve, reject) {
            try {
                await db.Group.update(
                    {
                        meeting: null,
                    },
                    {
                        where: {
                            meeting: id,
                        },
                    },
                );

                const meetings = await db.Meeting.update(
                    {
                        isDone: true,
                    },
                    {
                        where: {
                            id: id,
                        },
                    },
                );

                resolve(meetings);
            } catch (error) {
                console.log(error);
            }
        });
    }

    async handleAddGroupMeeting(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const GroupExit = await db.Group.findOne({
                    where: {
                        id: data.GrID,
                    },
                });

                if (GroupExit && GroupExit.meeting) {
                    return resolve({
                        errCode: 1,
                        msg: 'Group Bạn Thêm Đã Tồn Tại Hoặc Đang Có Lịch!',
                    });
                }

                const Meeting = await db.Meeting.findOne({
                    where: {
                        id: data.id,
                    },
                });

                if (!Meeting) {
                    return resolve({
                        errCode: 1,
                        msg: 'meeting not found',
                    });
                }

                let count = Meeting.count;

                if (count < 3) {
                    await db.Meeting.update(
                        {
                            count: count + 1,
                        },
                        {
                            where: {
                                id: data.id,
                            },
                        },
                    );

                    await db.Group.update(
                        {
                            meeting: data.id,
                            active: true,
                        },
                        {
                            where: {
                                id: data.GrID,
                            },
                        },
                    );

                    return resolve({
                        errCode: 0,
                        msg: 'Bạn đã thêm thành công group!',
                    });
                } else {
                    return resolve({
                        errCode: 1,
                        msg: 'Meeting full',
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    async getGetMeeting(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const meetings = await db.Meeting.findOne({
                    where: {
                        id: id,
                    },
                    include: [
                        { model: db.Group, as: 'DataMeeting' },
                        {
                            model: db.Group,
                            as: 'Data',
                            where: {
                                active: true,
                            },
                        },
                    ],
                });

                resolve(meetings);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getGetMeetingUser(id) {
        return new Promise(async function (resolve, reject) {
            try {
                const meetings = await db.Meeting.findOne({
                    where: {
                        id: id,
                    },
                    include: [
                        { model: db.Group, as: 'DataMeeting' },
                        {
                            model: db.Group,
                            as: 'Data',
                            where: {
                                active: true,
                            },
                        },
                    ],
                });

                resolve(meetings);
            } catch (error) {
                reject(error);
            }
        });
    }

    async handWorkMeetings(data) {
        return new Promise(async function (resolve, reject) {
            try {
                await db.Group.update(
                    {
                        link: data.link,
                        notify: data.notify,
                        isDone: true,
                    },
                    {
                        where: {
                            meeting: data.id,
                        },
                    },
                );

                await db.Meeting.update(
                    {
                        isDone: true,
                    },
                    {
                        where: {
                            id: data.id,
                        },
                    },
                );

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async handWorkMeetingUser(data) {
        return new Promise(async function (resolve, reject) {
            try {
                await db.Group.update(
                    {
                        linkStudent: data.link,
                        isDone: true,
                    },
                    {
                        where: {
                            meeting: data.id,
                            id: data.idGr,
                        },
                    },
                );

                await db.History.create({
                    groupID: data.idGr,
                    meetingID: data.id,
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleGetAllGroupAssets(id) {
        return new Promise(async (resolve, reject) => {
            try {
                // Tìm các bản ghi có userId trong mảng chứa ID user
                const records = await db.Group.findAll({
                    where: {
                        student: {
                            [Op.like]: `%${id}%`,
                        },
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data: records,
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    async handleActiveGroup(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const MeetingData = await db.Meeting.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: true,
                });

                if (!MeetingData) {
                    return resolve({
                        errCode: 1,
                        msg: "Couldn't find meeting",
                    });
                }

                if (data.active == false) {
                    await db.Group.update(
                        {
                            meeting: null,
                        },
                        {
                            where: {
                                meeting: data.id,
                                id: data.GrID,
                            },
                        },
                    );

                    await db.Meeting.update(
                        {
                            count: MeetingData.count - 1,
                        },
                        {
                            where: {
                                id: data.id,
                            },
                        },
                    );
                } else {
                    await db.Group.update(
                        {
                            active: true,
                            isDone: false,
                        },
                        {
                            where: {
                                meeting: data.id,
                                id: data.GrID,
                            },
                        },
                    );
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleGetAllMeetingActive() {
        return new Promise(async function (resolve, reject) {
            try {
                const data = await db.Meeting.findAll({
                    include: [{ model: db.User, as: 'DataUser' }],
                });

                console.log(data);

                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleGetAllMeetingsEmpty() {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.Meeting.findAll({
                    where: {
                        isCancelled: false,
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleBookingMeetingEmpty(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const checkCount = await db.Meeting.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: true,
                });

                if (!checkCount) {
                    return resolve({
                        errCode: 1,
                        msg: "Couldn't find",
                    });
                }

                if (checkCount.count == 3) {
                    return resolve({
                        errCode: 1,
                        msg: 'full count',
                    });
                }

                await db.Meeting.update(
                    {
                        count: checkCount.count + 1,
                    },
                    {
                        where: {
                            id: data.id,
                        },
                    },
                );

                await db.Group.update(
                    {
                        meeting: data.id,
                        active: false,
                    },
                    {
                        where: {
                            id: data.idGr,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                console.log(error);
            }
        });
    }

    async handleGetAllUser() {
        return new Promise(async function (resolve, reject) {
            try {
                const data = await db.User.findAll({
                    where: {
                        role: 'R1',
                    },
                });

                resolve(data);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    async handleGetDetailUser(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await db.User.findOne({
                    where: {
                        id,
                    },
                });

                if (!data) {
                    return resolve({
                        errCode: 1,
                        msg: 'User not found',
                    });
                }

                resolve({
                    errCode: 0,
                    msg: 'ok',
                    data,
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleUpdateUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.User.update(
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        role: data.role,
                    },
                    {
                        where: {
                            id: data.id,
                        },
                    },
                );

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async handleDeleteUser(id) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.User.destroy({
                    where: {
                        id,
                    },
                });

                resolve({
                    errCode: 0,
                    msg: 'ok',
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    async CheckEmailExist(email) {
        if (!email) {
            return 'Email is not a valid email';
        } else {
            const check = await db.User.findOne({
                where: {
                    email,
                },
            });

            if (check) {
                return true;
            } else {
                return false;
            }
        }
    }
}

module.exports = new SiteService();
