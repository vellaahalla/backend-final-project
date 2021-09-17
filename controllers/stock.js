const Stocks = require("../models/stocksModel");
const platform = require("../platform");

exports.all = async (req, res) => {

  let amountOfData, amountOfPage, previous, next, position, page;
  let id_warehouse = req.query.id_warehouse;
  let pages = [];
  let limit = 10;

  Stocks.countStocks(id_warehouse).then((result) => {
    amountOfData = result;
    amountOfPage = Math.ceil(amountOfData / limit);
    page = !req.query.page
      ? 1
      : parseInt(req.query.page) > amountOfPage
      ? amountOfPage
      : parseInt(req.query.page);

    previous = page > 1 ? page - 1 : false;
    next = page >= amountOfPage ? false : page + 1;
    // first page number
    page > 3 ? pages.push("...") : "";
    for (i = page - 2; i < page; i++) {
      if (i < 1) {
        continue;
      }
      pages.push(i);
    }
    // middle page number
    pages.push(page);
    for (i = page + 1; i < page + 3; i++) {
      if (i > amountOfPage) {
        break;
      }
      pages.push(i);
    }
    // last page number
    if (page + 2 < amountOfPage) {
      pages.push("...");
      pages.push(amountOfPage);
    }
    position = page === 1 ? 0 : (page - 1) * limit;
    let data = {
      limit,
      position,
      id_warehouse,
    };
    let selectStocks = Stocks.selectStocks(data);
    selectStocks.then((result) => {
      res.json({
        page: page,
        stocks: result,
        links: {
          first_page: 1,
          previous: previous,
          pages: pages,
          next: next,
          last_page: amountOfPage,
        },
      });
    });
  });
};