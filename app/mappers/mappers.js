exports.mapperUserList = ({ count, rows }, limit, page) => {
  const itemCount = count;
  const pageCount = Math.ceil(count / limit);
  return {
    users: rows,
    pageCount,
    itemCount,
    page
  };
};

exports.albumMapper = (id, title, userId) => ({
  id,
  title,
  userId
});
