class ScriptDSL < BaseDSL
  def initialize
    super
    @id = nil
    @lesson_groups = []
    @concepts = []
    @skin = nil
    @current_scriptlevel = nil
    @video_key_for_next_level = nil
    @login_required = false
    @hideable_lessons = false
    @student_detail_progress_view = false
    @teacher_resources = []
    @lesson_extras_available = false
    @project_widget_visible = false
    @has_verified_resources = false
    @curriculum_path = nil
    @project_widget_types = []
    @wrapup_video = nil
    @announcements = nil
    @new_name = nil
    @family_name = nil
    @version_year = nil
    @published_state = nil
    @supported_locales = []
    @pilot_experiment = nil
    @editor_experiment = nil
    @project_sharing = nil
    @curriculum_umbrella = nil
    @tts = false
    @deprecated = false
    @is_course = false
    @is_migrated = false
    @is_maker_unit = false
  end

  integer :id

  string :professional_learning_course
  boolean :only_instructor_review_required
  integer :peer_reviews_to_complete

  boolean :login_required
  boolean :hideable_lessons
  boolean :student_detail_progress_view
  boolean :lesson_extras_available
  boolean :project_widget_visible
  boolean :has_verified_resources
  boolean :project_sharing
  boolean :tts
  boolean :deprecated
  boolean :is_course
  boolean :is_migrated
  boolean :is_maker_unit

  string :wrapup_video
  string :announcements
  string :new_name
  string :family_name
  string :version_year
  string :curriculum_path
  string :pilot_experiment
  string :editor_experiment
  string :curriculum_umbrella
  string :published_state

  def teacher_resources(resources)
    @teacher_resources = resources
  end

  def project_widget_types(types)
    @project_widget_types = types
  end

  def supported_locales(locales)
    @supported_locales = locales
  end

  def pilot_experiment(experiment)
    @pilot_experiment = experiment
  end

  def lesson_group(key, properties = {})
    if key
      @lesson_groups << {
        key: key,
        display_name: properties[:display_name],
        big_questions: [],
        lessons: [],
        user_facing: true
      }.compact
    end
  end

  def lesson_group_description(description)
    @lesson_groups.last[:description] = description
  end

  def lesson_group_big_questions(questions)
    @lesson_groups.last[:big_questions] = questions
  end

  def lesson(key, properties = {})
    # For scripts that don't use lesson groups create a blank non-user facing lesson group
    if key
      if @lesson_groups.empty?
        @lesson_groups << {
          key: nil,
          display_name: nil,
          lessons: []
        }
      end

      @lesson_groups.last[:lessons] << {
        key: key,
        name: properties[:display_name],
        lockable: properties[:lockable],
        has_lesson_plan: properties[:has_lesson_plan],
        unplugged: properties[:unplugged],
        visible_after: determine_visible_after_time(properties[:visible_after]),
        script_levels: []
      }.compact
    end
  end

  # If visible_after value is blank default to next wednesday at 8am PDT
  # Otherwise use the supplied time
  def determine_visible_after_time(visible_after_value)
    if visible_after_value == ''
      current_time = Time.now
      raw_diff_to_wed = 3 - current_time.wday
      # Make sure it is the next wednesday not the one that just passed
      diff_to_next_wed = raw_diff_to_wed % 7
      next_wednesday = current_time + diff_to_next_wed.day
      visible_after_value = Time.new(next_wednesday.year, next_wednesday.month, next_wednesday.day, 8, 0, 0, '-07:00').to_s
    end

    visible_after_value
  end

  def parse_output
    lesson(nil)
    {
      id: @id,
      wrapup_video: @wrapup_video,
      login_required: @login_required,
      hideable_lessons: @hideable_lessons,
      student_detail_progress_view: @student_detail_progress_view,
      professional_learning_course: @professional_learning_course,
      only_instructor_review_required: @only_instructor_review_required,
      peer_reviews_to_complete: @peer_reviews_to_complete,
      teacher_resources: @teacher_resources,
      lesson_extras_available: @lesson_extras_available,
      has_verified_resources: @has_verified_resources,
      curriculum_path: @curriculum_path,
      project_widget_visible: @project_widget_visible,
      project_widget_types: @project_widget_types,
      announcements: @announcements,
      new_name: @new_name,
      family_name: @family_name,
      version_year: @version_year,
      published_state: @published_state,
      supported_locales: @supported_locales,
      pilot_experiment: @pilot_experiment,
      editor_experiment: @editor_experiment,
      project_sharing: @project_sharing,
      curriculum_umbrella: @curriculum_umbrella,
      tts: @tts,
      deprecated: @deprecated,
      lesson_groups: @lesson_groups,
      is_course: @is_course,
      is_migrated: @is_migrated,
      is_maker_unit: @is_maker_unit
    }
  end

  def concepts(*items)
    @concepts = items
  end

  def level_concept_difficulty(json)
    @level_concept_difficulty = json ? JSON.parse(json) : {}
  end

  string :skin
  string :video_key_for_next_level

  # If someone forgets we moved away from assessment as level type and puts
  # assessment as level type it will just nicely convert allow us to not fail but
  # it will convert it for the future to use the assessment: true syntax
  def assessment(name, properties = {})
    properties[:assessment] = true
    level(name, properties)
  end

  # If someone forgets we moved away from named_level and puts
  # named_level it will just nicely convert allow us to not fail but
  # it will convert it for the future to use the named: true syntax
  def named_level(name, properties = {})
    properties[:named_level] = true
    level(name, properties)
  end

  def bonus(name, properties = {})
    properties[:bonus] = true
    level(name, properties)
  end

  def level(name, properties = {})
    active = properties.delete(:active)
    progression = properties.delete(:progression)
    challenge = properties.delete(:challenge)
    experiments = properties.delete(:experiments)
    assessment = properties.delete(:assessment)

    named = properties.delete(:named)
    bonus = properties.delete(:bonus)

    level = {
      name: name,
      skin: @skin,
      concepts: @concepts.join(','),
      level_concept_difficulty: @level_concept_difficulty || {},
      video_key: @video_key_for_next_level
    }.merge(properties).select {|_, v| v.present?}
    @video_key_for_next_level = nil

    # Having @current_scriptlevel implies we're a level inside of a variants block
    if @current_scriptlevel
      @current_scriptlevel[:levels] << level

      levelprops = {}

      # Experiment levels are inactive unless explicitly marked active, which
      # is the opposite of normal levels. (Normally if you add a level variant
      # for an experiment group, you want everyone else to get the other level)
      active = false if !experiments.nil? && active.nil?

      levelprops[:active] = active if active == false
      levelprops[:experiments] = experiments if experiments.try(:any?)
      unless levelprops.empty?
        @current_scriptlevel[:properties][:variants] ||= {}
        @current_scriptlevel[:properties][:variants][name] = levelprops
      end

      @current_scriptlevel[:assessment] = assessment if assessment
      @current_scriptlevel[:bonus] = bonus if bonus
      @current_scriptlevel[:named_level] = named if named

      if progression
        # Variant levels must always have the same progression (or no progression)
        current_progression = @current_scriptlevel[:properties][:progression]
        if current_progression && current_progression != progression
          raise 'Variants levels must have the same progression'
        end
        @current_scriptlevel[:properties][:progression] = progression
      end

      @current_scriptlevel[:properties][:challenge] = challenge if challenge
    else
      script_level = {
        levels: [level]
      }

      script_level[:assessment] = assessment if assessment
      script_level[:bonus] = bonus if bonus
      script_level[:named_level] = named if named

      if progression || challenge
        script_level[:properties] = {}
        script_level[:properties][:progression] = progression if progression
        script_level[:properties][:challenge] = true if challenge
      end

      current_lesson_group = @lesson_groups.length - 1
      current_lesson = @lesson_groups[current_lesson_group][:lessons].length - 1
      @lesson_groups[current_lesson_group][:lessons][current_lesson][:script_levels] << script_level
    end
  end

  def variants
    @current_scriptlevel = {levels: [], properties: {}}
  end

  def endvariants
    @lesson_groups.last[:lessons].last[:script_levels] << @current_scriptlevel
    @current_scriptlevel = nil
  end

  # @override
  def i18n_hash
    i18n_lesson_strings = {}
    i18n_lesson_group_strings = {}
    @lesson_groups.each do |lesson_group|
      if lesson_group[:key]
        i18n_lesson_group_strings[lesson_group[:key]] = {}
        lesson_group.select {|k, v| [:display_name, :description, :big_questions].include?(k) && !v.nil_or_empty?}.each do |k, v|
          i18n_lesson_group_strings[lesson_group[:key]][k.to_s] = v
        end
      end
      lesson_group[:lessons].each do |lesson|
        i18n_lesson_strings[lesson[:key]] = {'name' => lesson[:name]}
      end
    end

    {@name => {
      'lessons' => i18n_lesson_strings,
      'lesson_groups' => i18n_lesson_group_strings
    }}
  end

  def self.parse_file(filename, name = nil)
    super(filename, name || File.basename(filename, '.script'))
  end

  def self.serialize(script, filename)
    File.write(filename, serialize_to_string(script))
  end

  def self.serialize_to_string(script)
    # the serialized data for migrated scripts lives in the .script_json file
    return "is_migrated true\n" if script.is_migrated

    s = []
    # Legacy script IDs
    legacy_script_ids = {
      '20-hour': 1,
      'Hour of Code': 2,
      'edit-code': 3,
      events: 4,
      flappy: 6,
      jigsaw: 7,
    }.with_indifferent_access
    s << "id '#{legacy_script_ids[script.name]}'" if legacy_script_ids[script.name]

    s << "professional_learning_course '#{script.professional_learning_course}'" if script.professional_learning_course
    s << "only_instructor_review_required #{script.only_instructor_review_required}" if script.only_instructor_review_required
    s << "peer_reviews_to_complete #{script.peer_reviews_to_complete}" if script.peer_reviews_to_complete.try(:>, 0)

    s << 'login_required true' if script.login_required
    s << 'hideable_lessons true' if script.hideable_lessons
    s << 'student_detail_progress_view true' if script.student_detail_progress_view
    s << "wrapup_video '#{script.wrapup_video.key}'" if script.wrapup_video
    s << "teacher_resources #{script.teacher_resources}" if script.teacher_resources
    s << 'lesson_extras_available true' if script.lesson_extras_available
    s << 'has_verified_resources true' if script.has_verified_resources
    s << "curriculum_path '#{script.curriculum_path}'" if script.curriculum_path
    s << 'project_widget_visible true' if script.project_widget_visible
    s << "project_widget_types #{script.project_widget_types}" if script.project_widget_types
    s << "announcements #{script.announcements}" if script.announcements
    s << "new_name '#{script.new_name}'" if script.new_name
    s << "family_name '#{script.family_name}'" if script.family_name
    s << "version_year '#{script.version_year}'" if script.version_year
    s << "published_state '#{script.published_state}'" if script.published_state
    s << "supported_locales #{script.supported_locales}" if script.supported_locales
    s << "pilot_experiment '#{script.pilot_experiment}'" if script.pilot_experiment
    s << "editor_experiment '#{script.editor_experiment}'" if script.editor_experiment
    s << 'project_sharing true' if script.project_sharing
    s << "curriculum_umbrella '#{script.curriculum_umbrella}'" if script.curriculum_umbrella
    s << 'tts true' if script.tts
    s << 'deprecated true' if script.deprecated
    s << 'is_course true' if script.is_course
    s << "is_maker_unit true" if script.is_maker_unit

    s << '' unless s.empty?
    s << serialize_lesson_groups(script)
    s.join("\n")
  end

  def self.serialize_lesson_groups(script)
    s = []
    script.lesson_groups.each do |lesson_group|
      if lesson_group&.user_facing && !lesson_group.lessons.empty?
        t = "lesson_group '#{escape(lesson_group.key)}'"
        t += ", display_name: '#{escape(lesson_group.display_name)}'" if lesson_group.display_name
        s << t
        s << "lesson_group_description '#{escape(lesson_group.description)}'" if lesson_group.description
        s << "lesson_group_big_questions '#{escape(lesson_group.big_questions)}'" if lesson_group.big_questions
      end
      lesson_group.lessons.each do |lesson|
        s << serialize_lesson(lesson)
      end
    end
    s << ''
    s.join("\n")
  end

  def self.serialize_lesson(lesson)
    s = []

    t = "lesson '#{escape(lesson.key)}'"
    t += ", display_name: '#{escape(lesson.name)}'" if lesson.name
    t += ', lockable: true' if lesson.lockable
    t += ", has_lesson_plan: #{!!lesson.has_lesson_plan}"
    t += ", visible_after: '#{escape(lesson.visible_after)}'" if lesson.visible_after
    t += ', unplugged: true' if lesson.unplugged
    s << t
    lesson.script_levels.each do |sl|
      type = 'level'
      type = 'bonus' if sl.bonus

      if sl.levels.count > 1
        s << 'variants'
        sl.levels.each do |level|
          s.concat(
            serialize_level(
              level,
              type,
              sl.active?(level),
              sl.progression,
              sl.named_level?,
              sl.challenge,
              sl.assessment,
              sl.experiments(level)
            ).map {|l| l.indent(2)}
          )
        end
        s << 'endvariants'
      else
        s.concat(serialize_level(sl.level, type, nil, sl.progression, sl.named_level?, sl.challenge, sl.assessment))
      end
    end
    s << ''
    s.join("\n")
  end

  def self.serialize_level(
    level,
    type,
    active = nil,
    progression = nil,
    named = nil,
    challenge = nil,
    assessment = nil,
    experiments = []
  )
    named_level_name = named && (level.display_name || level.name)
    progression_name = progression || named_level_name
    s = []
    l = "#{type} '#{escape(level.key)}'"
    l += ', active: false' if experiments.empty? && active == false
    l += ', active: true' if experiments.any? && (active == true || active.nil?)
    l += ", experiments: #{experiments.to_json}" if experiments.any?
    l += ", progression: '#{escape(progression_name)}'" if progression_name
    l += ', assessment: true' if assessment
    l += ', challenge: true' if challenge
    s << l
    s
  end

  def self.escape(str)
    str.gsub("'") {"\\'"}
  end
end
