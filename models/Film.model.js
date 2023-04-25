const { Schema, model } = require("mongoose");


const filmSchema = new Schema(
    {
        brand: {
            type: String,
            required: true 
        },
        camera: {
            type: String,
            required: true,
        },
        asa: {
            type: Number,
            required: true,
        },
        format: {
            type: String, 
            required: true,
        },
        blackWhiteOrColor: {
            type: String,
            required: true
        },
        filter: {
            type: String,
            required: true
        },
        title: String,
        location: String,
        startedFilm: Date,
        endedFilm: Date,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
    }
);

const Film = model("Film", filmSchema);

module.exports = Film;