import pool from '../config/db.js';

const AssignmentModel = {
    assignTourLeader: async (groupId, tourLeaderId) => {
        const result = await pool.query(
            `INSERT INTO group_assignments (group_id, tour_leader_id, role)
             VALUES ($1, $2, 'TOUR_LEADER') RETURNING *`,
            [groupId, tourLeaderId]
        );
        return result.rows[0];
    },

    getTourLeadersByGroup: async (groupId) => {
        const result = await pool.query(
            `SELECT tl.*, ga.assigned_at, ga.id as assignment_id
             FROM tour_leaders tl
             JOIN group_assignments ga ON tl.id = ga.tour_leader_id
             WHERE ga.group_id = $1 AND ga.role = 'TOUR_LEADER'`,
            [groupId]
        );
        return result.rows;
    },

    unassignTourLeader: async (groupId, tourLeaderId) => {
        await pool.query(
            `DELETE FROM group_assignments WHERE group_id = $1 AND tour_leader_id = $2 AND role = 'TOUR_LEADER'`,
            [groupId, tourLeaderId]
        );
        return { message: 'Tour leader unassigned' };
    },

    assignMuthawif: async (groupId, muthawifId) => {
        const result = await pool.query(
            `INSERT INTO group_assignments (group_id, muthawif_id, role)
             VALUES ($1, $2, 'MUTHAWIF') RETURNING *`,
            [groupId, muthawifId]
        );
        return result.rows[0];
    },

    getMuthawifsByGroup: async (groupId) => {
        const result = await pool.query(
            `SELECT m.*, ga.assigned_at, ga.id as assignment_id
             FROM muthawifs m
             JOIN group_assignments ga ON m.id = ga.muthawif_id
             WHERE ga.group_id = $1 AND ga.role = 'MUTHAWIF'`,
            [groupId]
        );
        return result.rows;
    },

    unassignMuthawif: async (groupId, muthawifId) => {
        await pool.query(
            `DELETE FROM group_assignments WHERE group_id = $1 AND muthawif_id = $2 AND role = 'MUTHAWIF'`,
            [groupId, muthawifId]
        );
        return { message: 'Muthawif unassigned' };
    }
};

export default AssignmentModel;
