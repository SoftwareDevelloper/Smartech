package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.DTO.SchoolLevelsDTO;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SchoolLevelService {
    public SchoolLevelsDTO getSchoolLevels() {
        SchoolLevelsDTO dto = new SchoolLevelsDTO();

        // Main levels (Primary, HighSchool, Secondary)
        dto.setMainLevels(Arrays.asList(
                createLevelOption("Primary", "Primary"),
                createLevelOption("HighSchool","High School"),
                createLevelOption("Secondary", "Secondary")
        ));

        // Level groups with classes
        dto.setLevelGroups(Arrays.asList(
                createLevelGroup("Primary", Arrays.asList(
                        createLevelOption("1Primary","1ère"),
                        createLevelOption("2Primary", "2ème"),
                        createLevelOption("3Primary", "3ème"),
                        createLevelOption("4Primary", "4ème"),
                        createLevelOption("5Primary", "5ème"),
                        createLevelOption("6Primary","6ème")
                )),
                createLevelGroup("HighSchool", Arrays.asList(
                        createLevelOption("7HS", "7ème"),
                        createLevelOption("8HS", "8ème"),
                        createLevelOption("9HS", "9ème")
                )),
                createLevelGroup("Secondary", Arrays.asList(
                        // 2ème
                        createLevelOption("2Lettre", "2Lettre"),
                        createLevelOption("2Eco", "2Eco"),
                        createLevelOption("2Math", "2Math"),
                        createLevelOption("2Science","2Science"),
                        createLevelOption("2Technique", "2Technique"),

                        // 3ème
                        createLevelOption("3Lettre","3Lettre"),
                        createLevelOption("3Eco","3Eco"),
                        createLevelOption("3Math","3Math"),
                        createLevelOption("3Science","3Science"),
                        createLevelOption("3Technique", "3Technique"),
                        // Bac
                        createLevelOption("BLettre", "Bac Lettre"),
                        createLevelOption("BEco", "Bac Eco"),
                        createLevelOption("BMath", "Bac Math"),
                        createLevelOption("BScience", "Bac Science"),
                        createLevelOption("BTechnique", "Bac Technique")
                ))
        ));

        return dto;
    }

    private SchoolLevelsDTO.LevelOption createLevelOption(String id, String label) {
        SchoolLevelsDTO.LevelOption option = new SchoolLevelsDTO.LevelOption();
        option.setId(id);
        option.setLabel(label);
        return option;
    }

    private SchoolLevelsDTO.LevelGroup createLevelGroup(String groupName, List<SchoolLevelsDTO.LevelOption> levels) {
        SchoolLevelsDTO.LevelGroup group = new SchoolLevelsDTO.LevelGroup();
        group.setGroupName(groupName);
        group.setLevels(levels);
        return group;
    }


}
