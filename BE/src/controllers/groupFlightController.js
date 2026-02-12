import GroupFlightSegmentModel from '../models/groupFlightModel.js';

const GroupFlightController = {
    // GET /groups/:id/flights — list all segments for a group
    getSegments: async (req, res) => {
        try {
            const segments = await GroupFlightSegmentModel.findByGroupId(req.params.id);
            res.json({ success: true, message: 'Flight segments retrieved', data: segments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // POST /groups/:id/flights — add a segment
    addSegment: async (req, res) => {
        try {
            const segment = await GroupFlightSegmentModel.create(req.params.id, req.body);
            res.status(201).json({ success: true, message: 'Flight segment added', data: segment });
        } catch (error) {
            // Handle unique constraint violation for segment_order
            if (error.code === '23505') {
                return res.status(409).json({
                    success: false,
                    message: 'Segment order already exists for this group',
                    data: null
                });
            }
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // PUT /groups/:id/flights/:segmentId — update a segment
    updateSegment: async (req, res) => {
        try {
            const segment = await GroupFlightSegmentModel.update(req.params.segmentId, req.body);
            if (!segment) {
                return res.status(404).json({ success: false, message: 'Segment not found', data: null });
            }
            res.json({ success: true, message: 'Flight segment updated', data: segment });
        } catch (error) {
            if (error.code === '23505') {
                return res.status(409).json({
                    success: false,
                    message: 'Segment order already exists for this group',
                    data: null
                });
            }
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    },

    // DELETE /groups/:id/flights/:segmentId — delete a segment
    deleteSegment: async (req, res) => {
        try {
            await GroupFlightSegmentModel.delete(req.params.segmentId);
            res.json({ success: true, message: 'Flight segment deleted', data: null });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message, data: null });
        }
    }
};

export default GroupFlightController;
