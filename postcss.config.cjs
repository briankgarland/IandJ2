module.exports = {
    plugins: [
      require('postcss-preset-env')({
        stage: 0,
      }),
      require("cssnano"),
      require('postcss-utilities'),
      require("rucksack-css"),
      
    ]
  }



