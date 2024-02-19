import mongoose from 'mongoose';

const suraTranslationSchema = new mongoose.Schema({
    sura: Number,
    aya: Number,
    text: {
        arabic: String,
        german: String,
        turkish: String,
        english: String
    },
    textLength: {
        arabic: Number,
        german: Number,
        turkish: Number,
        english: Number,
        min: Number,
        max: Number
    }
}, {
    collection: 'QuranAya'
});

const SuraTranslation = mongoose.model('SuraTranslation', suraTranslationSchema);

export default SuraTranslation;
