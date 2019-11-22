const queryResults = (model) => async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    const ignoreFields = ['select', 'sort', 'limit', 'page', 'populate', 'pselect'];

    ignoreFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = model.find(JSON.parse(queryStr));

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query =  query.select(fields);
    };

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    };

    if (req.baseUrl.endsWith('leagues')) {
        query = query.populate('teams');
    } else if (req.baseUrl.endsWith('teams')) {
        query = query.populate({
            path: 'league players'
        });
    } else if (req.baseUrl.endsWith('players')) {
        query = query.populate('team');
    }

    // console.log(req.baseUrl, req.originalUrl);

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);
    
    const teams = await query;

    const pagination = { currentPage: page };

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({ success: true, count: teams.length, pagination, data: teams });
    next();
}

module.exports = queryResults;