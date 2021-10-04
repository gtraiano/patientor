"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
const api_1 = __importDefault(require("./routes/api"));
const diagnoses_1 = __importDefault(require("./routes/diagnoses"));
const patients_1 = __importDefault(require("./routes/patients"));
const icdcodelookup_1 = __importDefault(require("./routes/icdcodelookup"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', api_1.default);
app.use('/api/diagnoses', diagnoses_1.default);
app.use('/api/patients', patients_1.default);
app.use('/api/icdclookup', icdcodelookup_1.default);
const PORT = 3001;
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // Connect to MongoDB
        if (!process.env.MONGODB_URI) {
            console.log('MongoDB uri is not set');
            process.exit(0);
        }
        try {
            yield (0, mongoose_1.connect)(process.env.MONGODB_URI);
            const uri = process.env.MONGODB_URI.match(/@.+\//);
            console.log(`Connected to MongoDB`, uri ? uri[0] : '');
        }
        catch (error) {
            console.log(error.message);
            process.exit(1);
        }
    });
}
const disconnectFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.disconnect)();
    console.log('Disconnected from MongoDB');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectToDB().catch(err => console.log(err.message));
});
process.on('beforeExit', () => __awaiter(void 0, void 0, void 0, function* () { return yield disconnectFromDB(); }));
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    yield disconnectFromDB();
    console.log('Caught termination signal');
}));
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield disconnectFromDB();
    console.log('Caught interrupt signal');
}));
