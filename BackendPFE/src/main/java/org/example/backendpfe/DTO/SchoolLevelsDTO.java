package org.example.backendpfe.DTO;

import java.util.List;

public class SchoolLevelsDTO {

    private List<LevelOption> mainLevels;
    private List<LevelGroup> levelGroups;

    public List<LevelOption> getMainLevels() {
        return mainLevels;
    }

    public void setMainLevels(List<LevelOption> mainLevels) {
        this.mainLevels = mainLevels;
    }

    public List<LevelGroup> getLevelGroups() {
        return levelGroups;
    }

    public void setLevelGroups(List<LevelGroup> levelGroups) {
        this.levelGroups = levelGroups;
    }

    public static class LevelOption {
        private String id;
        private String label;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }
    }

    public static class LevelGroup {
        private String groupName;
        private List<LevelOption> levels;

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public List<LevelOption> getLevels() {
            return levels;
        }

        public void setLevels(List<LevelOption> levels) {
            this.levels = levels;
        }
    }
}
