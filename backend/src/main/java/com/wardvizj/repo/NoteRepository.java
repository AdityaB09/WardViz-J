// NoteRepository.java
package com.wardvizj.repo;
import com.wardvizj.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface NoteRepository extends JpaRepository<Note, UUID> {
  List<Note> findByPatientIdOrderByTsAsc(String patientId);
}
