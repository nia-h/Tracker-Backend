const BadRequestErr = function ({ controller, method, err }) {
  //this.code = 400;
  this.message = `Error occurred in ${controller ? `${controller}.` : ""}${method}: ${err}`;
};
BadRequestErr.create = ({ controller, method, err }) => new BadRequestErr({ controller, method, err });

module.exports = { BadRequestErr };
