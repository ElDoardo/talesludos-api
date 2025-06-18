class JourneyService {
    async getUserJourneys(userId, pagination) {}
    async getPublishedJourneys(pagination) {}
    async getJourneyById(id) {}
    async getJourneyForEdit(id) {}
    async prepareDownload(userId, journeyId) {}
    async createJourney(journeyData) {}
    async processBase64Image(base64Data, userId) {}
    async updateJourney(id, journeyData) {}
    async deleteJourney(id) {}
    async sendImage(id,fileName){}

}

module.exports = JourneyService;