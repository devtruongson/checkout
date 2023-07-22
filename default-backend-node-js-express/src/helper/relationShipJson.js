const { Op } = require('sequelize');

const handleRelationShipJson = (modelOne, modelTwo, string = 'group') => {
    return modelOne
        .findAll()
        .then(async (classes) => {
            for (const cls of classes) {
                const idArray = JSON.parse(JSON.parse(cls[string]));

                const groups = await modelTwo.findAll({
                    where: {
                        id: {
                            [Op.in]: idArray, // Sử dụng Op.in để lấy tất cả các group có id trong mảng
                        },
                    },
                    raw: true,
                });

                return groups;
            }
        })
        .catch((error) => {
            console.log('Lỗi:', error);
        });
};

module.exports = handleRelationShipJson;
