import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters() {
        try {
            return await callApi(this.#endpoint);
        } catch (error) {
            console.error('Failed to load fighters:', error);
            throw error;
        }
    }

    // Method to get a single fighter by ID
    async getFighterInfo(fighterId) {
        try {
            const fighters = await this.getFighters();
            const fighter = fighters.find(f => f._id === fighterId);

            return fighter || null;
        } catch (error) {
            console.error('Failed to load fighter info:', error);
            throw error;
        }
    }
}

export default new FighterService();
