export const datePickerCustomStyles = {
    '.rdrCalendarWrapper': {
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    '.rdrDateDisplayWrapper': {
        backgroundColor: '#fff',
        borderRadius: '8px 8px 0 0',
    },
    '.rdrDateRangeWrapper': {
        paddingTop: '4px',
        paddingBottom: '8px',
    },
    '.rdrMonth': {
        width: '300px',
        padding: '0 8px',
    },
    '.rdrStartEdge, .rdrEndEdge': {
        color: '#fff !important',
        backgroundColor: '#F37736 !important',
        opacity: '1',
    },
    '.rdrInRange': {
        color: '#F37736 !important',
        backgroundColor: '#F37736 !important',
        opacity: '0.5',
    },
    '.rdrDayHovered': {
        borderRadius: '50%',
        backgroundColor: '#f5f5f5 !important',
    },
    '.rdrDayToday .rdrDayNumber span:after': {
        background: '#F37736',
    },
    '.rdrDayNumber span': {
        color: '#333',
        fontWeight: 500,
        fontSize: '0.9rem',
    },
    '.rdrMonthAndYearPickers select': {
        color: '#333',
        fontWeight: 600,
        //   padding: '0.5rem',
        borderRadius: '20px',
        border: '1px solid #ddd',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
    '.rdrWeekDay': {
        color: '#666',
        fontWeight: 600,
        fontSize: '0.8rem',
        textTransform: 'uppercase',
    },
    '.rdrDayStartPreview, .rdrDayEndPreview': {
        color: '#F37736',
        borderColor: '#F37736',
    },
    '.rdrDayInPreview': {
        color: '#FFF1EA',
    },
    '.rdrDayPassive .rdrDayNumber span': {
        color: '#ddd',
    },
    '.rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span': {
        color: '#fff !important',
        fontWeight: 600,
    },
    '.rdrMonthName': {
        color: '#333',
        fontWeight: 600,
        fontSize: '1rem',
        padding: '0.5rem 0',
    },
    '.rdrNextPrevButton': {
        background: '#f5f5f5',
        borderRadius: '4px',
        '&:hover': {
            background: '#eee',
        }
    },
};