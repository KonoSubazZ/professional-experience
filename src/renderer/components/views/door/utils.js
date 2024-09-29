export const getDateTime = () => {
    const now = new Date()
    const visitDate = now.toISOString().substring(0,10)
    const visitTime = now.toTimeString().substring(0,8)
    return {
        visitDateTime:visitDate + ' ' + visitTime,
        visitDate,
        visitTime,
    }
}
