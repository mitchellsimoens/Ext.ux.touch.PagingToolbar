/*
    Author       : Mitchell Simoens
    Site         : http://simoens.org/Sencha-Projects/demos/
    Contact Info : mitchellsimoens@gmail.com
    Purpose      : Needed to have a paging toolbar for Ext.DataView, Ext.List, and Ext.ux.TouchGridPanel

	License      : GPL v3 (http://www.gnu.org/licenses/gpl.html)
    Warranty     : none
    Price        : free
    Version      : 1.0
    Date         : 2/5/2011
*/

Ext.ns("Ext.ux.touch");

Ext.ux.touch.PagingToolbar = Ext.extend(Ext.Toolbar, {
	/**
	  * Dock Location. Default - "bottom" Options: "bottom", "top", "left", "right"
	  * @type String
	  */
	dock: "bottom",
	/**
	  * True to hide/show buttons when option not available. False to enable/disable
	  * @type Boolean
	  */
	hideBtn: true,
	/**
	  * {@link Ext.Button} config object for the Previous button
	  * @type Object
	  */
	prevBtnCfg: {},
	/**
	  * {@link Ext.Button} config object for the Next button
	  * @type Object
	  */
	nextBtnCfg: {},

	//private
	constructor: function(config) {
		if (typeof config !== "object") { config = {}; }
		Ext.apply(config, this.setupToolbar() || {});

		Ext.apply(this, config);
		Ext.ux.touch.PagingToolbar.superclass.constructor.call(this, config);
	},

	//private
	init: function(cmp) {
		this.cmp = cmp;

		if (typeof this.store === "undefined" && typeof cmp.store === "object") {
			this.store = cmp.store;
		}

		this.store.on("load", this.fillSelectField, this, { single: true });
		this.store.on("load", this.handleStoreLoad, this);

		cmp.on("afterrender", this.initToolbar, this);
	},

	//private
	initToolbar: function() {
		this.cmp.addDocked(this);
		this.cmp.doComponentLayout();
	},

	//private
	setupToolbar: function() {
		Ext.applyIf(this.prevBtnCfg, {
			text: "Previous",
			ui: "back"
		});
		Ext.applyIf(this.nextBtnCfg, {
			text: "Next",
			ui: "forward"
		});

		this.prevBtn = new Ext.Button(this.prevBtnCfg);
		this.nextBtn = new Ext.Button(this.nextBtnCfg);

		this.prevBtn.on("tap", this.handlePrevPage, this);
		this.nextBtn.on("tap", this.handleNextPage, this);

		this.selectField = new Ext.form.Select(this.createSelectField());

		return {
			items: [
				this.prevBtn,
				{ xtype: "spacer" },
				this.selectField,
				this.nextBtn
			]
		};
	},

	//private
	handlePrevPage: function() {
		this.store.previousPage();
	},

	//private
	handleNextPage: function() {
		this.store.nextPage();
	},

	//private
	onPageChoose: function(select, value) {
		this.store.loadPage(value);
	},

	/**
     * Returns the number of records possible in Store
     * @publich
     */
	getTotalRecs: function() {
		var store = this.store;
		var proxy = store.getProxy();
		var reader = proxy.getReader();

		return Number (Ext.DomQuery.selectNode(reader.totalProperty, proxy.reader.rawData).textContent);
	},

	//private
	handleStoreLoadBtn: function(store, btn, pageMatch) {
		var doThis = "hide";
		if (store.currentPage === pageMatch) {
			if (!this.hideBtn) {
				doThis = "disable";
			}
		} else {
			if (this.hideBtn) {
				doThis = "show";
			} else {
				doThis = "enable"
			}
		}
		btn[doThis]();
	},

	//private
	handleStoreLoad: function(store, recs, success) {
		if (success) {
			this.handleStoreLoadBtn(store, this.prevBtn, 1);

			var totalNum = this.getTotalRecs();
			var numPages = Math.ceil(totalNum / store.pageSize);
			this.handleStoreLoadBtn(store, this.nextBtn, numPages);

			this.selectField.setValue(store.currentPage);
		}
	},

	//private
	createSelectField: function() {
		return {
			name: "pt-options",
			options: [
				{ text: "Go to", value: null }
			],
			listeners: {
				scope: this,
				change: this.onPageChoose
			}
		};
	},

	//private
	fillSelectField: function(store, recs, success) {
		if (success) {
			var totalNum = this.getTotalRecs();
			var numPages = Math.ceil(totalNum / store.pageSize);

			var options = [];

			for (var i = 1; i <= numPages; i++) {
				options.push({ text: "Page "+i, value: i });
			}

			this.selectField.setOptions(options);
		}
	}
});

Ext.preg("pagingtoolbar", Ext.ux.touch.PagingToolbar);