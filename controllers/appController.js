const unexpectedRouteController = (req, res) => {
  console.log(`404: Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    isStatus: false,
    msg: `Route not found: ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
    data: null,
  });
};


module.exports = {
  unexpectedRouteController,
};