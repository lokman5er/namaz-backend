import mongoose from 'mongoose';

const MoonSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            unique: true,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    { collection: 'moonFractions' }
);

const MoonModel = mongoose.model('MoonSchema', MoonSchema);

export default MoonModel;
