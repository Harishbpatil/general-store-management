
const { General } = require("../models/general");

exports.createItem = async (req, res) => {
  try {
    const newItem = await General.create({
      item: req.body["item"],
      description: req.body["description"],
      price: req.body["price"],
      quantity: req.body["quantity"],
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await General.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateItem = async (req, res) => {
  const itemId = req.params.id;
  const action = req.body.action;

  try {
    const item = await General.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    let quantityToDecrease = 0;

    if (action === "buy1") {
      quantityToDecrease = 1;
    } else if (action === "buy2") {
      quantityToDecrease = 2;
    } else if (action === "buy3") {
      quantityToDecrease = 3;
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    if (item.quantity < quantityToDecrease) {
      return res.status(400).json({ error: "Not enough quantity available" });
    }

    item.quantity -= quantityToDecrease;

    await item.save();

    res
      .status(200)
      .json({
        message: "Item quantity updated successfully",
        quantity: item.quantity,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteItem = async (req, res) => {
  const itemId = req.params.id;

  try {
    const deletedRows = await General.destroy({
      where: { id: itemId },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
