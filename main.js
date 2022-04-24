IMPORT("BlockEngine");
IMPORT("Patched");

var CustomName = WRAP_JAVA("com.core.api.Item");

var ItemName = {
	customs: {},
	names: {},
	setName(id, data, name, add){
		if(Item.nameOverrideFunctions[id] && !Item.isNativeItem(id)){
			Patched.patchedToObject(Item.nameOverrideFunctions, String(id), function(controller){
				let result = controller.getResult();
				controller.setResult(result+name);
			}, Flags.AFTER);
			return;
		}
		this.customs[id] = {
			id: id,
    	data: data || 0,
			name: name,
			add: !!add
		};
	},
 local(data){
 	let keys = Object.keys(data);
 	for(let i in keys){
 		let obj = data[keys[i]];
 		if(!ItemName.names[obj.id])
 			ItemName.names[obj.id] = Translation.translate(Item.getName(obj.id, 0));
 		if(obj.add)
 			CustomName.overrideName(obj.id, ItemName.names[obj.id] + obj.name);
 		else
 			CustomName.overrideName(obj.id, obj.name);
 	}
 }
};

let items = {};
let blocks = {};

Patched.patchedToObject(Item, "createItem", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);

Patched.patchedToObject(Item, "createFoodItem", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);

Patched.patchedToObject(Item, "createArmorItem", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);

Patched.patchedToObject(Item, "createThrowableItem", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);

Patched.patchedToObject(Item, "createArmorItem", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);

Patched.patchedToObject(Block, "createBlock", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		blocks[controller.getArguments()[0]] = mod;
}, Flags.BEFORE);

Patched.patchedToObject(Block, "createBlockWithRotation", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		blocks[controller.getArguments()[0]] = mod;
}, Flags.AFTER);

Patched.patchedToObject(ItemRegistry, "registerItem", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0].stringID] = mod;
}, Flags.AFTER);

Patched.patchedToObject(ItemRegistry, "createItem", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.AFTER);

Patched.patchedToObject(ItemRegistry, "createFood", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.AFTER);

Patched.patchedToObject(ItemRegistry, "createArmor", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.AFTER);

Patched.patchedToObject(ItemRegistry, "createTool", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		items[controller.getArguments()[0]] = mod;
}, Flags.AFTER);

Patched.patchedToObject(BlockRegistry, "registerBlock", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		blocks[controller.getArguments()[0].stringID] = mod;
}, Flags.AFTER);

Patched.patchedToObject(BlockRegistry, "createBlock", function(controller){
	let mod = controller.getContextValue("__name__");
	if(mod instanceof java.lang.String)
		blocks[controller.getArguments()[0]] = mod;
}, Flags.AFTER);

let tool_tip = __config__.get("tool_tip");
let tool_tip_fuel = __config__.get("tool_tip_fuel");

const ItemInformation = {
	handlers: [],
	addHandler(obj){
		this.handlers.push(obj);
	}
};

ItemInformation.addHandler({
	addToolTip(tip, id, stringID, mod, items){
		let time = Recipes.getFuelBurnDuration(id, 0);
		if(time > 0){
			let name = tip + tool_tip_fuel;
			name = name.replace("{time}", String(time));
			return name;
		}
		return tip
	}
});

ItemInformation.addHandler({
	addToolTip(tip, id, stringID, mod, items){
		let name = tip + tool_tip;
		name = name.replace("{id}", String(id));
		name = name.replace("{strId}", stringID);
		name = name.replace("{mod}", mod);
		return name;
	}
});

function register(obj, types){
	let keys = Object.keys(obj);
	for(let i in keys){
		let key = keys[i];
		let id = obj[key];
		let name = "";
		let mod = String(types[key] || "minecraft");
		mod = mod[0].toUpperCase() + mod.substring(1);
		for(let i in ItemInformation.handlers)
			name = ItemInformation.handlers[i].addToolTip(name, id, key, mod, obj);
		ItemName.setName(id, 0, name, true);
	}
}

Callback.addCallback("ModsLoaded", function(){
	Callback.addCallback("LocalLevelLoaded", function(){
		register(ItemID, items);
		register(BlockID, blocks);
		register(VanillaItemID, {});
		register(VanillaBlockID, {});
		
		ItemName.local(ItemName.customs);
	});
});

ModAPI.registerAPI("ItemInformation", {
	items: items,
	blocks: blocks,
	ItemInformation: ItemInformation,
	requireGlobal(cmd){
		return eval(cmd);
	}
});