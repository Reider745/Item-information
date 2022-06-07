IMPORT("BlockEngine");
IMPORT("Patched");

var ToolTip = WRAP_JAVA("com.reider.ToolTip");
var items = {};
var blocks = {};

Patched.patchedToObject(Item, "createItem", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);
Patched.patchedToObject(Item, "createFoodItem", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);
Patched.patchedToObject(Item, "createArmorItem", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);
Patched.patchedToObject(Item, "createThrowableItem", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);
Patched.patchedToObject(Item, "createArmorItem", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);
Patched.patchedToObject(Block, "createBlock", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        blocks[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);
Patched.patchedToObject(Block, "createBlockWithRotation", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        blocks[controller.getArguments()[0]] = mod;
}, Flags.AFTER);
Patched.patchedToObject(ItemRegistry, "registerItem", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0].stringID] = mod;
}, Flags.AFTER);
Patched.patchedToObject(ItemRegistry, "createItem", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.AFTER);
Patched.patchedToObject(ItemRegistry, "createFood", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.AFTER);
Patched.patchedToObject(ItemRegistry, "createArmor", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.AFTER);
Patched.patchedToObject(ItemRegistry, "createTool", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        items[controller.getArguments()[0]] = mod;
}, Flags.AFTER);
Patched.patchedToObject(BlockRegistry, "registerBlock", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        blocks[controller.getArguments()[0].stringID] = mod;
}, Flags.AFTER);
Patched.patchedToObject(BlockRegistry, "createBlock", function (controller) {
    var mod = controller.getContextValue("__name__");
    if (mod instanceof java.lang.String)
        blocks[controller.getArguments()[0]] = mod;
}, Flags.AFTER);

var tool_tip = __config__.get("tool_tip") || "§r§7Number id - {id}\nText id - {strId}\n§9{mod}§r";
var tool_tip_fuel = __config__.get("tool_tip_fuel") || "§r§7Fuel burn duration - {time}§r";

var ItemInformation = {
    handlers: [],
    addHandler: function (obj) {
        this.handlers.push(obj);
    }
};
ItemInformation.addHandler({
    addToolTip: function (tip, id, stringID, mod, items) {
        var time = Recipes.getFuelBurnDuration(id, 0);
        if (time > 0) {
            var name = tip + tool_tip_fuel;
            name = name.replace("{time}", String(time));
            return name;
        }
        return tip;
    }
});
ItemInformation.addHandler({
    addToolTip: function (tip, id, stringID, mod, items) {
        var name = tip + tool_tip;
        name = name.replace("{id}", String(id));
        name = name.replace("{strId}", stringID);
        name = name.replace("{mod}", mod);
        return name;
    }
});

function register(obj, types) {
    var keys = Object.keys(obj);
    for (var i in keys) {
        var key = keys[i];
        var id = obj[key];
        var name = "";
        var mod = String(types[key] || "minecraft");
        mod = mod[0].toUpperCase() + mod.substring(1);
        for (var i_1 in ItemInformation.handlers)
            name = ItemInformation.handlers[i_1].addToolTip(name, id, key, mod, obj) + (ItemInformation.handlers.length > 1 && ItemInformation.handlers.length - 1 != i_1 ? "\n" : "");
        ToolTip.addToolTip(id, -1, name);
    }
}

Callback.addCallback("ModsLoaded", function () {
    Callback.addCallback("LocalLevelLoaded", function () {
        ToolTip.clearToolTips();
        register(ItemID, items);
        register(BlockID, blocks);
        register(VanillaItemID, {});
        register(VanillaBlockID, {});
    });
});

ModAPI.registerAPI("ItemInformation", {
    items: items,
    blocks: blocks,
    ItemInformation: ItemInformation,
    requireGlobal: function (cmd) {
        return eval(cmd);
    }
});