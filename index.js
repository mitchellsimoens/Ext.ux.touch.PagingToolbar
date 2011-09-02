Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']
});

Ext.setup({
    onReady: function() {
        var store = new Ext.data.JsonStore({
            model  : 'Contact',
            autoLoad : true,
            sorters: 'lastName',

            //JSON proxy
            proxy : {
                type : 'ajax',
                url  : 'data.php',
                extraParams : {
                    type : 'json'
                },
                reader : {
                    type : 'json',
                    root : 'data'
                }
            },

            //XML proxy
            /*proxy : {
                type : 'ajax',
                url  : 'data.php',
                extraParams : {
                    type : 'xml'
                },
                reader : {
                    type   : 'xml',
                    root   : 'data',
                    record : 'contact'
                }
            },*/

            getGroupString : function(record) {
                return record.get('lastName')[0];
            }
        });

        new Ext.Panel({
            fullscreen : true,
            layout     : 'fit',
            plugins    : new Ext.ux.touch.PagingToolbar({
                store : store
            }),
            items      : {
                xtype    : 'list',
                itemTpl  : '{firstName} {lastName}',
                grouped  : true,
                indexBar : true,
                store    : store
            }
        });
    }
});