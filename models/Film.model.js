const { Schema, model } = require("mongoose");


const filmSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
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
        color: {
            type: String,
            required: true
        },
        filter: {
            type: String,
            required: true
        },
        location: String,
        startedFilm: Date,
        endedFilm: Date,
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
    }
);

const User = model("Film", filmSchema);

module.exports = Film;