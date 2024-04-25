var express = require("express");
const models = require("./models");
var router = express.Router();

router.get("/history", function(req, res, next) {
	models.History.find({}).then((history) => {
		console.log(history);
		res.status(200).send(history);
	});
});

router.get("/history/:date", function(req, res, next) {
	console.log(req.params.date);
	const zip = (a, b) => a.map((k, i) => [k, b[i]]);
	models.History.findOne({ date: req.params.date }).then((item) => {
		const item_count = zip(item.clothes, item.amts);
		const items = item_count.map((pair) => {
			return `${pair[0]} ${pair[1]}`;
		});
		const text = items.join(", ");
		const final_text = `${item.total} total, ` + text;
		res.send(final_text);
	});
});

router.get("/copy", (req, res, next) => {
	models.SubmitItem.find({}).then((items) => {
		console.log(items);
		const total = items
			.map((item) => {
				return item.amt;
			})
			.reduce((a, b) => {
				return a + b;
			}, 0);
		if (total > 0) {
			const formatted_items = items
				.map((item) => `${item.amt} ${item.name}`)
				.join(", ");
			const result = `${total} total, ${formatted_items}`;
			console.log(result);
			res.send(result);
		} else {
			res.send("");
		}
	});
});

router.get("/items/submit", (req, res, next) => {
	models.SubmitItem.find({}).then((items) => {
		res.status(200).send(items);
	});
});

router.post("/new", function(req, res, next) {
	console.log(req.query);
	console.log(req.body);
	switch (req.query.op) {
		case "new":
			models.SubmitItem.exists({ name: "cloth" })
				.then((result) => {
					if (result == null) {
						let item = models.SubmitItem();
						item.amt = 1;
						item.name = "cloth";
						item.save().then((_) => {
							models.SubmitItem.find({}).then((items) => {
								console.log(items);
								res.status(200).send(items);
							});
						});
					} else {
						res
							.status(409)
							.send("Rename existing before trying to add new clothes");
						return;
					}
				})
				.catch((err) => res.status(404).send(err));
			break;
		case "increment":
			console.log(req.body);
			models.SubmitItem.findOne({ name: req.body.name })
				.then((item) => {
					console.log(item);
					item.amt += 1;
					item.save().then((_) => {
						models.SubmitItem.find({}).then((items) => {
							console.log(items);
							res.status(200).send(items);
						});
					});
				})
				.catch((err) => res.status(404).send(err));
			break;
		case "decrement":
			models.SubmitItem.findOne({ name: req.body.name })
				.then((item) => {
					if (item.amt == 1) {
						models.SubmitItem.findOneAndDelete({
							name: item.name,
							amt: item.amt,
						})
							.exec()
							.then((_) => {
								models.SubmitItem.find({}).then((items) => {
									console.log(items);
									res.status(200).send(items);
								});
							});
					} else {
						item.amt -= 1;
						item.save().then((_) => {
							models.SubmitItem.find({}).then((items) => {
								console.log(items);
								res.status(200).send(items);
							});
						});
					}
				})
				.catch((err) => {
					console.log(err);
					res.status(404).send(err);
				});
			break;
		case "change":
			if (Object.values(req.body)[0] === "") {
				models.SubmitItem.find({}).then((items) => {
					console.log(items);
					res.status(200).send(items);
				});
				return;
			}
			models.SubmitItem.findOne({ name: Object.values(req.body)[0] }).then(
				(result) => {
					if (result != null) {
						res.status(409).send("Cloth type already exists");
						return;
					}
					models.SubmitItem.findOne({ name: Object.keys(req.body)[0] })
						.then((item) => {
							item.name = Object.values(req.body)[0];
							item.save().then((_) => {
								models.SubmitItem.find({}).then((items) => {
									console.log(items);
									res.status(200).send(items);
								});
							});
						})
						.catch((err) => res.status(404).send(err));
				},
			);
			break;
		default:
			res.sendStatus(403);
			return;
	}
});

router.post("/submit", (req, res, next) => {
	models.CollectItem.find({}).then((collect) => {
		if (collect.length != 0) {
			console.log(collect);
			res
				.status(409)
				.send("Collect the current clothes before submitting new ones.");
			return;
		}
		models.SubmitItem.find({})
			.then((items) => {
				let history = new models.History();
				const total = items
					.map((item) => {
						return item.amt;
					})
					.reduce((a, b) => {
						return a + b;
					});
				history.total = total;
				const date = new Date().setHours(0, 0, 0, 0);
				history.date = date;
				history.clothes = items.map((item) => item.name);
				history.amts = items.map((item) => item.amt);
				history.save();

				items.forEach((item) => {
					let collect = new models.CollectItem();
					collect.total_amt = item.amt;
					collect.count = item.amt;
					collect.name = item.name;
					collect.save();
				});

				models.SubmitItem.deleteMany({}).then((_) => {
					res.status(200).send();
				});
			})
			.catch((err) => res.send(err));
	});
});

router.get("/items/collect", (req, res, next) => {
	models.CollectItem.find({}).then((items) => {
		res.status(200).send(items);
	});
});

router.post("/collect", function(req, res, next) {
	console.log(req.query);
	switch (req.query.op) {
		case "decrement":
			models.CollectItem.findOne({ name: req.body.name }).then((item) => {
				if (item == null) {
					res.status(404).send("Not found");
					return;
				}
				if (item.count > 0) {
					console.log(item);
					item.count -= 1;
					item.save().then((_) => {
						models.CollectItem.find({}).then((items) => {
							res.status(200).send(items);
						});
					});
				}
			});
			break;
		case "reset":
			models.CollectItem.findOne({ name: req.body.name }).then((item) => {
				if (item == null) {
					res.status(404).send("Not found");
					return;
				}
				item.count = item.total_amt;
				item.save().then((_) => {
					models.CollectItem.find({}).then((items) => {
						res.status(200).send(items);
					});
				});
			});
			break;
		default:
			res.sendStatus(403);
			return;
	}
});

router.post("/finish", function(req, res, next) {
	models.CollectItem.deleteMany({}).then((_) => {
		res.sendStatus(200);
	});
});

module.exports = router;
