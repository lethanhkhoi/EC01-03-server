function dataPagination(match, sort, page = 1, limit = 10) {
  const aggregate = [{ $match: match }];
  let data = [];
  data.push({ $sort: sort });
  if (page > 1) {
    let skip = (page - 1) * limit;
    data.push({ $skip: skip });
  }
  data.push({ $limit: limit });
  aggregate.push({ $facet: { data } });
  return aggregate;
}
module.exports = {
  dataPagination,
  handlePagination
}
