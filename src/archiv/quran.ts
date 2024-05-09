import axios from 'axios';
import fs from 'fs';
import {promisify} from 'util';

const writeFileAsync = promisify(fs.writeFile);

interface QuranTranslationText {
    tr: string;
    ar: string;
    de: string;
}

interface QuranVerse {
    textMin: number;
    textMax: number;
    text: QuranTranslationText;
}

type QuranSura = QuranVerse[];

type Quran = QuranSura[];

async function fetchAndStoreTranslationsWithVerification(suraNumber: number): Promise<QuranSura> {
    const languages = {
        german: 'german_bubenheim',
        turkish: 'turkish_shaban',
    };

    let translationResults: any = {};

    for (const [key, value] of Object.entries(languages)) {
        try {
            const response = await axios.get(`https://quranenc.com/api/v1/translation/sura/${value}/${suraNumber}`);
            translationResults[key] = response.data.result;
            await delay(1000);
        } catch (error) {
            console.error(`Error fetching ${key} translations for Sura ${suraNumber}:`, error);
            throw error; // Instead of returning, throw error to stop execution
        }
    }

    return translationResults.german.map((germanVerse: any, index: number) => ({
        text: {
            ar: germanVerse.arabic_text,
            de: germanVerse.translation,
            tr: translationResults.turkish[index].translation,
        },
        textMin: Math.min(
            germanVerse.arabic_text.length,
            germanVerse.translation.length,
            translationResults.turkish[index].translation.length
        ),
        textMax: Math.max(
            germanVerse.arabic_text.length,
            germanVerse.translation.length,
            translationResults.turkish[index].translation.length
        )
    }));
}

export async function fetchAndStoreAllTranslations() {
    const quran: Quran = [];

    for (let suraNumber = 1; suraNumber <= 3; suraNumber++) {
        console.log(`Fetching translations for Sura ${suraNumber}...`);
        const suraTranslations = await fetchAndStoreTranslationsWithVerification(suraNumber);
        quran.push(suraTranslations);
        console.log(`Finished Sura ${suraNumber}. Waiting 1 second before continuing...`);
        await delay(1000); // Keeping delay as per your request
    }

    try {
        await writeFileAsync('quran.json', JSON.stringify(quran));
        console.log('Finished saving all translations to quran_translations.json.');
    } catch (error) {
        console.error('Error saving translations to file:', error);
    }
}

async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
