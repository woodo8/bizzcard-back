import mongoose, { Mongoose } from "mongoose";
import { BizzCard, validateCard } from "../models/bizzCardSchema.js";

export const createNewCard = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {

        // Find the user by the id in params
        const { id: id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id")


        // Create the new Card
        let newCard = {
            ...req.body,
            owner: id,
        };

        // Add images to the database
        if (req.files['profile_img']) {
            newCard.profile_img = req.files['profile_img'][0].path;
        }
        if (req.files['background_img']) {
            newCard.background_img = req.files['background_img'][0].path;
        }


        // Validate errors
        const { error } = validateCard(newCard);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Save the new card in the database
        newCard = await new BizzCard(newCard);
        await newCard.save();
        return res.status(200).json(newCard);
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export const getMyCards = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {
        const { id: id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id")

        const myCards = await BizzCard.find({ owner: id });

        let newArr = [...myCards]
        let sortedArray = newArr.sort(function (a, b) {
            // @ts-ignore
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        return res.status(200).json(sortedArray);

    } catch (error) {
        return res.status(400).send(error.message)
    }

}

export const getAllCards = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {
        const cards = await BizzCard.find({});
        let newArr = [...cards]
        let sortedArray = newArr.sort(function (a, b) {
            // @ts-ignore
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        return res.status(200).json(sortedArray);

    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export const getCard = async (req, res) => {
    // #swagger.tags = ['Cards']

    try {
        const { id: id } = req.params;
        const card = await BizzCard.findById(id);

        // Check if the user id is valid
        if (!card) {
            return res.status(400).send("Card not found");
        }
        return res.status(200).json(card);

    } catch (error) {
        return res.status(400).send(error.message)
    }

}
export const editCard = async (req, res) => {
    // #swagger.tags = ['Cards']

    try {
        const { userId: userId, cardId: cardId } = req.params;

        let cardinfos = { ...req.body };
        if (!mongoose.Types.ObjectId.isValid(cardId)) return res.status(404).send("No card with that id");

        // Add images to the database
        if (req.files['profile_img']) {
            cardinfos.profile_img = req.files['profile_img'][0].filename;
        }
        if (req.files['background_img']) {
            cardinfos.background_img = req.files['background_img'][0].filename;
        }
        const updatedCard = await BizzCard.findOneAndUpdate({ _id: cardId, owner: userId }, { ...cardinfos, updatedAt: Date.now(), cardId }, { new: true });
        if (!updatedCard) {
            return res.status(404).send("Card not found");
        }
        return res.status(200).json(updatedCard);
    } catch (err) {
        return res.status(401).send(err.message);
    }
}
export const deleteCard = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {
        const { userId: userId, cardId: cardId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cardId)) return res.status(404).send("No card with that id");

        await BizzCard.findOneAndDelete({ _id: cardId, owner: userId });
        return res.status(200).send("Deleted successfully");
    } catch (err) {
        return res.status(401).send(err.message);
    }
}

export const visitTrackIncrement = async (req, res) => {
    try {
        const { cardId } = req.params;
        const lastVisitTime = req.headers['x-last-visit-time']; // Retrieve the last visit time from the request header

        if (!mongoose.Types.ObjectId.isValid(cardId)) return res.status(404).send("No card with that id");

        const card = await BizzCard.findById(cardId);
        if (!card) {
            return res.status(404).send("Card not found");
        }

        // Determine if the visit should be counted
        let shouldIncrement = true;
        const currentTime = new Date().getTime();
        if (lastVisitTime) {
            const lastVisit = parseInt(lastVisitTime);
            const timeDifference = (currentTime - lastVisit) / (1000 * 60 * 60); // Difference in hours
            if (timeDifference < 1) {
                shouldIncrement = false; // Less than one hour since the last visit
            }
        }

        // Only increment if more than one hour has passed
        let updatedCard;
        if (shouldIncrement) {
            updatedCard = await BizzCard.findOneAndUpdate(
                { _id: cardId },
                { $inc: { visits: 1 } }, // Increment the visits field by 1
                { new: true }
            );
        } else {
            updatedCard = card;
        }

        return res.status(200).json(updatedCard);
    } catch (err) {
        return res.status(401).send(err.message);
    }
}

export const incrementShareCount = async (req, res) => {
    const { cardId } = req.params;

    try {
        const card = await BizzCard.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }

        card.shares += 1;
        await card.save();

        res.status(200).json({ message: 'Share count incremented successfully', shares: card.shares });
    } catch (error) {
        res.status(500).json({ message: 'Failed to increment share count', error: error.message });
    }
};
export const getLocation = async (req, res) => {
    const { cardId } = req.params;
    const { city, deviceType } = req.body;
    if (!city) {
        return res.status(400).send({ error: 'City name is required' });
    }

    try {
        // Find the card document
        const card = await BizzCard.findById(cardId);

        if (!card) {
            return res.status(404).send({ error: 'Card not found' });
        }

        // Update the city visit count
        const cityVisits = card.cityVisits;
        const currentCount = cityVisits.get(city) || 0;
        cityVisits.set(city, currentCount + 1);

        const expectedDeviceTypes = ['Mobile', 'Tablet', 'Desktop'];

        // Filter out any unexpected keys from deviceTypes
        const deviceTypes = new Map();
        expectedDeviceTypes.forEach(type => {
            const currentCount = card.deviceTypes.get(type) || 0;
            deviceTypes.set(type, currentCount);
        });

        // Update the specific device type count from the request
        if (expectedDeviceTypes.includes(deviceType)) {
            const currentDeviceCount = deviceTypes.get(deviceType) || 0;
            deviceTypes.set(deviceType, currentDeviceCount + 1);
        }

        // Replace the card's deviceTypes with the filtered deviceTypes
        card.deviceTypes = deviceTypes;

        // Save the updated card document
        await card.save();

        res.status(200).send(card);
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
};