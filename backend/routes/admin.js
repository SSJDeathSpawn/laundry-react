var express = require("express");
const models = require("./models");
var router = express.Router();

router.get("/", function(req, res, next) {
	res.render("index");
});

router.get("/stats", async function(req, res, next) {
	const history = await models.History.find({});
	const collectItems = await models.CollectItem.find({});
	const submitItems = await models.CollectItem.find({});
	res.render("stats", {
		history: history,
		collectItems: collectItems,
		submitItems: submitItems,
	});
});

router.get("/tables/history", function(req, res, next) {
	models.History.find({}).then((items) => {
		res.render("history_table", { items: items });
	});
});

router.get("/tables/collect", function(req, res, next) {
	models.CollectItem.find({}).then((items) => {
		res.render("collect_table", { items: items });
	});
});

router.get("/tables/submit", function(req, res, next) {
	models.SubmitItem.find({}).then((items) => {
		res.render("submit_table", { items: items });
	});
});

module.exports = router;
