const { Op } = require('sequelize');

const handleRelationShipJson = (modelOne, modelTwo, string = 'group', where) => {
    return modelOne
        .findOne(where)
        .then(async (classes) => {
            const result = [];

            console.log(classes);

            try {
                const idArray = JSON.parse(JSON.parse(classes.student));

                console.log('check idArray :', idArray);

                const groups = await modelTwo.findAll({
                    where: {
                        id: {
                            [Op.in]: [...idArray],
                        },
                    },
                    raw: true,
                });

                result.push(...groups);
            } catch (error) {
                console.log('Lỗi khi phân tích cú pháp chuỗi JSON:', error);
            }

            return result;
        })
        .catch((error) => {
            console.log('Lỗi:', error);
        });
};

module.exports = handleRelationShipJson;
