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
                    include: [{ model: db.Meeting, as: 'DataMeeting' }],
                });

                let DataUser = [];

                if (group) {
                    DataUser = await handleRelationShipJson(db.Group, db.User, 'student');

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
                if (data.type == 'group') {
                    if (data.isTeacher === 'R0') {
                        await db.Meeting.update(
                            {
                                isCancelled: true,
                            },
                            {
                                where: {
                                    groupID: data.groupID,
                                },
                            },
                        );
                    }

                    await db.Meeting.create({
                        day: data.day,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        groupID: data.groupID,
                        isTeacher: data.isTeacher == 'R1' ? false : true,
                    });
                } else {
                    await db.Meeting.create({
                        day: data.day,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        isTeacher: data.isTeacher,
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
