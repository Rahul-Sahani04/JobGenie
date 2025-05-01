flowchart TD
    subgraph Decision Table - Job Matching System
        Conditions[Conditions]
        Actions[Actions]
        
        subgraph Conditions
            C1[Skill Match Level]
            C2[Location Match]
            C3[Experience Match]
            C4[Salary Match]
            C5[Industry Match]
        end
        
        subgraph Actions
            A1[Show as Perfect Match]
            A2[Show as High Match]
            A3[Show as Moderate Match]
            A4[Show as Low Match]
            A5[Don't Show]
        end
        
        subgraph Rules
            R1[Rule 1:<br>All conditions match<br>→ Perfect Match]
            R2[Rule 2:<br>Skills & Experience match<br>→ High Match]
            R3[Rule 3:<br>Only Skills match<br>→ Moderate Match]
            R4[Rule 4:<br>Minimal matches<br>→ Low Match]
            R5[Rule 5:<br>No significant matches<br>→ Don't Show]
        end
        
        subgraph Match Criteria
            M1[Perfect Match:<br>90-100% compatibility]
            M2[High Match:<br>70-89% compatibility]
            M3[Moderate Match:<br>50-69% compatibility]
            M4[Low Match:<br>30-49% compatibility]
            M5[No Match:<br>Below 30% compatibility]
        end
        
        subgraph Decision Flow
            DF1[1. Calculate Skill Match]
            DF2[2. Check Location]
            DF3[3. Verify Experience]
            DF4[4. Compare Salary]
            DF5[5. Assess Industry]
            DF6[6. Determine Final Match]
        end
        
        DF1 --> DF2
        DF2 --> DF3
        DF3 --> DF4
        DF4 --> DF5
        DF5 --> DF6
        
        DF6 --> |≥90%| A1
        DF6 --> |70-89%| A2
        DF6 --> |50-69%| A3
        DF6 --> |30-49%| A4
        DF6 --> |<30%| A5
    end