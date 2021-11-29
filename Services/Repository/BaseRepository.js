"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseRepository = /** @class */ (function () {
    function BaseRepository(model) {
        this.model = model;
    }
    BaseRepository.prototype.find = function (id) {
        return this.model.find(id);
    };
    return BaseRepository;
}());
exports.default = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map