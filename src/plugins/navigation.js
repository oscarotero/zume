'use strict';

const through = require('through2');
const path = require('path');

class Section extends Array {
    constructor(id) {
        super();
        this.id = id;
    }

    setData(name, value) {
        if (typeof name === 'object') {

            for (let k in name) {
                this[k] = name[k];
            }

            return;
        }

        this[name] = value;
    }

    has(id) {
        return this.get(id) !== undefined;
    }

    get(id) {
        return this.find(section => section.id === id);
    }

    getOrCreate(id) {
        if (this.has(id)) {
            return this.get(id);
        }

        const section = new Section(id);
        this.push(section);
        return section;
    }

    order() {
        this.sort((a, b) => {
            if (a.position < b.position) {
                return -1;
            }
            if (a.position > b.position) {
                return 1;
            }
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });
    }
};

module.exports = function (options) {
    options = options || {};

    const override = options.override || {};
    const data = options.data || [];
    const sections = new Section();
    const files = [];

    return through.obj(
        function(file, encoding, callback) {
            files.push(file);
            file.data.nav = sections;

            const pieces = file.relative.split(path.sep);
            pieces.pop();

            let tree = sections;
            let id = '';

            file.data.id = pieces.join('/');

            while (pieces.length) {
                id += (id ? '/' : '') + pieces.shift();
                
                const section = tree.getOrCreate(id);

                if (!pieces.length) {
                    section.setData({
                        title: file.data.title,
                        position: file.data.position
                    });

                    if (data.length) {
                        data.forEach(field => section.setData(field, file.data[field]));
                    }
                }

                if (id in override) {
                    section.setData(override[id]);
                }

                tree.order();
                tree = section;
            }

            callback();
        },
        function(done) {
            files.forEach(file => this.push(file));
            done();
        }
    );
}
