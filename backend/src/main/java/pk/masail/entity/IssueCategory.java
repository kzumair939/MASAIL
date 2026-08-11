package pk.masail.entity;

public enum IssueCategory {
    ROAD("Road & Pothole"),
    WATERLOGGING("Waterlogging"),
    GARBAGE("Garbage Collection"),
    STREETLIGHT("Street Lights"),
    SEWERAGE("Sewerage / Nala"),
    WATER("Water Supply (KWSB)"),
    PARKS("Parks & Green Spaces"),
    TRAFFIC("Traffic Signal"),
    ENCROACHMENT("Encroachment");

    public final String label;

    IssueCategory(String label) {
        this.label = label;
    }

    /** Categories a Verified Resident is allowed to self-report (requirement #6). */
    public static final IssueCategory[] RESIDENT_REPORTABLE = { ROAD, STREETLIGHT, SEWERAGE };

    public static boolean isResidentReportable(IssueCategory category) {
        for (IssueCategory c : RESIDENT_REPORTABLE) {
            if (c == category) return true;
        }
        return false;
    }
}
