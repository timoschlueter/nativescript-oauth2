const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	webpack.chainWebpack((config) => {
		config.merge({
			resolve: {
				preferRelative: true,
			},
		});
	});

	return webpack.resolveConfig();
};
