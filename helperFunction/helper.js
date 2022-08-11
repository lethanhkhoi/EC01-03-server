const nodemailer = require("nodemailer");
function dataPagination(match, sort, page = 1, limit = 10) {
  const aggregate = [{ $match: match }];
  let data = [];
  data.push({ $sort: sort });

  if (page > 1) {
    let skip = (page - 1) * limit;
    data.push({ $skip: skip });
  }
  data.push({ $limit: parseInt(limit) });
  let facet = {
    metadata: [
      { $count: "recordTotal" },
      { $addFields: { pageCurrent: page, recordPerPage: limit } },
    ],
    data: data,
  };
  aggregate.push({ $facet: facet });
  return aggregate;
}

function sendPass(newpass, email) {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "hethongquanliweb@gmail.com",
      pass: "lethanhkhoi123",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mainOptions = {
    // thiết lập đối tượng, nội dung gửi mail
    from: "<hethongquanliweb@gmail.com>",
    to: email,
    subject: "Test Nodemailer",
    text: newpass,
    html: `<div style="background-color: #ea562dda; padding: 2em 2em;">
                    <h4 style="text-align: center;">Hello your new password is ${newpass}. Please return to the login screen to continue!</h4>
                </div>`,
  };
  transport.sendMail(mainOptions, (error) => {
    if (error) {
      return console.log(error);
    }
  });
}
module.exports = {
  dataPagination,
  sendPass,
};
