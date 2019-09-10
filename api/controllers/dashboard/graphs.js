module.exports = {


  friendlyName: 'View graphs page',


  description: 'Display the dashboard "Graphs" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/graphs',
      description: 'Display the graphs page for authenticated users.'
    },

  },


  fn: async function () {

    return {};

  }


};
